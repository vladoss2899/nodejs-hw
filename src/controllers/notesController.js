// import { use } from 'react';
import { Note } from '../models/notes.js';
import createHttpError from 'http-errors';

export const getNotes = async (req, res) => {
  const { page = 1, perPage = 10, minMark, search } = req.query;

  const skip = (page - 1) * perPage;

  const notesQuery = Note.find({ userId: req.user._id });

  if (minMark) {
    notesQuery.where('avgMark').gte(minMark);
  }

  if (search) {
    notesQuery.where({
      $text: { $search: search },
    });
  }

  // подібний приклад до ..↑.. тільки не потрібно шукати ідеально по індексу а можна вписати половину

  // if (search) {
  //   notesQuery.where({
  //     name: { $regex: search, $options: 'i' },
  //   });
  // }

  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    data: notes,
    page,
    perPage,
    totalItems,
    totalPages,
  });
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(createHttpError(400, 'Invalid note ID'));
    console.log(error);
  }
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json({ data: note });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({ data: note });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { new: true },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({ note });
};
