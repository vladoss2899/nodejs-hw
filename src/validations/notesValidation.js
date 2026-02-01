import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

export const getAllNotesSchema = {
  [Segments.QUERY]: {
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(15).default(10),
  },
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).trim().required(),
    content: Joi.string().max(2000).trim().allow('').default(''),
    tag: Joi.string().valid(...TAGS),
  }),
};

const objectIdValidator = (value, helpers) => {
  const isValidId = isValidObjectId(value);
  return !isValidId ? helpers.message('Invalid id format!') : value;
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).trim(),
    content: Joi.string().max(2000).trim(),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
};
