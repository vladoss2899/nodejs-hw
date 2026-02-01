import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

export const getNotesSchema = {
  [Segments.QUERY]: {
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(15).default(10),
  },
};

export const createNoteBodySchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(33).required(),
    age: Joi.number().min(18).max(65).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    avgMark: Joi.number().min(1).max(12).required(),
    onDuty: Joi.boolean(),
  }),
};

const objectIdValidator = (value, helpers) => {
  const isValidId = isValidObjectId(value);
  return !isValidId ? helpers.message('Invalid id format!') : value;
};

export const NoteIdParams = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(33),
    age: Joi.number().min(18).max(65),
    gender: Joi.string().valid('male', 'female', 'other'),
    avgMark: Joi.number().min(1).max(12),
    onDuty: Joi.boolean(),
  }).min(1),
};
