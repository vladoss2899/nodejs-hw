import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    tag: { type: String, enum: TAGS },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// текстовий індекс для пошуку по title і content
noteSchema.index({ title: 'text', content: 'text' });

export const Note = model('Note', noteSchema);
