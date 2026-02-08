import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).end();
};

export const refreshUserSession = async (req, res) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json({ message: 'Password reset email sent successfully' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw createHttpError(500, 'JWT_SECRET is not configured');
  }

  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email },
    jwtSecret,
    {
      expiresIn: '15m',
    },
  );

  const frontend = process.env.FRONTEND_DOMAIN
    ? process.env.FRONTEND_DOMAIN.replace(/\/$/, '')
    : '';
  if (!frontend) {
    throw createHttpError(500, 'FRONTEND_DOMAIN is not configured');
  }
  const resetLink = `${frontend}/reset-password?token=${encodeURIComponent(token)}`;

  let template = '';
  try {
    template = await fs.readFile(
      new URL('../templates/reset-password-email.html', import.meta.url),
      'utf-8',
    );
  } catch (err) {
    // If template read fails, still try to send a simple email
    console.warn('Failed to read reset email template:', err && err.message);
    template =
      '<p>Hello {{name}},</p><p>Please reset your password using the link: <a href="{{resetLink}}">Reset password</a></p>';
  }

  const compiled = Handlebars.compile(template);
  const html = compiled({ name: user.username || user.email, resetLink });

  try {
    await sendEmail({ to: user.email, subject: 'Password reset', html });
  } catch (err) {
    console.error('sendEmail error:', err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.status(200).json({ message: 'Password reset email sent successfully' });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const jwtSecretVerify = process.env.JWT_SECRET;
  if (!jwtSecretVerify) {
    throw createHttpError(500, 'JWT_SECRET is not configured');
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecretVerify);
  } catch (err) {
    console.warn('JWT verify failed:', err && err.message);
    throw createHttpError(401, 'Invalid or expired token');
  }

  const { sub: userId, email } = payload;

  const user = await User.findOne({ _id: userId, email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
};
