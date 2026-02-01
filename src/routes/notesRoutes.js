import { celebrate } from 'celebrate';
import {
  createNoteBodySchema,
  NoteIdParams,
  updateNoteSchema,
  getNotesSchema,
} from '../validations/notesValidation.js';

import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use('/notes', authenticate);

router.get('/notes', celebrate(getNotesSchema), getAllNotes);
router.get('/notes/:noteId', celebrate(NoteIdParams), getNoteById);
router.post('/notes', celebrate(createNoteBodySchema), createNote);
router.delete('/notes/:noteId', celebrate(NoteIdParams), deleteNote);
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
