// import { use } from 'react';
import { Student } from '../models/students.js';
import createHttpError from 'http-errors';

export const getStudents = async (req, res) => {
  const { page = 1, perPage = 10, minMark, search } = req.query;

  const skip = (page - 1) * perPage;

  const studentsQuery = Student.find({ userId: req.user._id });

  if (minMark) {
    studentsQuery.where('avgMark').gte(minMark);
  }

  if (search) {
    studentsQuery.where({
      $text: { $search: search },
    });
  }

  // подібний приклад до ..↑.. тільки не потрібно шукати ідеально по індексу а можна вписати половину

  // if (search) {
  //   studentsQuery.where({
  //     name: { $regex: search, $options: 'i' },
  //   });
  // }

  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    studentsQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    data: students,
    page,
    perPage,
    totalItems,
    totalPages,
  });
};

export const getStudentById = async (req, res, next) => {
  try {
    const { studentsId } = req.params;

    const student = await Student.findOne({
      _id: studentsId,
      userId: req.user._id,
    });

    if (!student) {
      return next(createHttpError(404, 'Student not found'));
    }

    res.status(200).json(student);
  } catch (error) {
    next(createHttpError(400, 'Invalid student ID'));
    console.log(error);
  }
};

export const createStudents = async (req, res) => {
  const student = await Student.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json({ data: student });
};

export const deleteStudents = async (req, res) => {
  const { studentsId } = req.params;

  const student = await Student.findOneAndDelete({
    _id: studentsId,
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json({ data: student });
};

export const updateStudent = async (req, res) => {
  const { studentsId } = req.params;

  const student = await Student.findOneAndUpdate(
    { _id: studentsId, userId: req.user._id },
    req.body,
    { new: true },
  );

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json({ student });
};
