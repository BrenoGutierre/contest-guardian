import { prisma } from './db.js';
import { z } from 'zod';

export async function myResults(req, res) {
  try {
    const results = await prisma.result.findMany({
      where: { userId: req.user.sub },
      include: { exam: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(results);
  } catch (e) {
    res.status(500).json({ message: 'Falha ao buscar resultados' });
  }
}

const ResultDto = z.object({
  examId: z.string().uuid(),
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
  timeMin: z.number().int().min(0).optional().nullable()
});

export async function createResult(req, res) {
  try {
    const data = ResultDto.parse(req.body);
    const result = await prisma.result.create({
      data: {
        userId: req.user.sub,
        examId: data.examId,
        correct: data.correct,
        total: data.total,
        timeMin: data.timeMin ?? 0
      },
      include: { exam: true }
    });
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e?.message || 'Falha ao criar resultado' });
  }
}
