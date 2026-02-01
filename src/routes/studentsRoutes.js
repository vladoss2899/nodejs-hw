import { celebrate } from 'celebrate';
import {
  createStudentsBodySchema,
  StudentsIdParams,
  updateStudentsSchema,
  getStudentsSchema,
} from '../validations/StudentsValidation.js';

import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudents,
  deleteStudents,
  updateStudent,
} from '../controllers/studentsController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use('/students', authenticate);

router.get('/students', celebrate(getStudentsSchema), getStudents);
router.get(
  '/students/:studentsId',
  celebrate(StudentsIdParams),
  getStudentById,
);
router.post('/students', celebrate(createStudentsBodySchema), createStudents);
router.delete(
  '/students/:studentsId',
  celebrate(StudentsIdParams),
  deleteStudents,
);
router.patch(
  '/students/:studentsId',
  celebrate(updateStudentsSchema),
  updateStudent,
);

export default router;
