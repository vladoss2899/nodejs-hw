import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const buffer = req.file.buffer;

  let uploadResult;
  try {
    uploadResult = await saveFileToCloudinary(buffer);
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw createHttpError(500, 'Failed to upload the file');
  }

  const url = uploadResult.secure_url;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: url },
    { new: true },
  );

  res.status(200).json({ url: updated.avatar });
};
