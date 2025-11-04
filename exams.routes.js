import { Router } from 'express';
import { requireAuth } from './auth.js';
import { listExams, createExam } from './exams.controller.js';

const r = Router();

r.get('/', requireAuth, listExams);
r.post('/', requireAuth, createExam);

export default r;

