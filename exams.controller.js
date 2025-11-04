import { prisma } from './db.js';
import { z } from 'zod';

export async function listExams(req, res) {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(exams);
  } catch (e) {
    res.status(500).json({ message: 'Falha ao listar exames' });
  }
}

const ExamDto = z.object({
  title: z.string().min(3),
  scheduledAt: z.string().datetime().optional().nullable(),
  durationMinutes: z.number().int().positive().optional().nullable()
});

export async function createExam(req, res) {
  try {
    const data = ExamDto.parse(req.body);
    const exam = await prisma.exam.create({
      data: {
        title: data.title,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        durationMinutes: data.durationMinutes ?? null,
        createdById: req.user.sub
      }
    });
    res.status(201).json(exam);
  } catch (e) {
    res.status(400).json({ message: e?.message || 'Falha ao criar exame' });
  }
}

