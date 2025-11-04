import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const titles = [
    'PC — Legislação',
    'TRT — Português',
    'PM — RLM',
    'TRF — Português & RLM',
    'Simulado Polícia Penal — Objetiva'
  ];

  for (const t of titles) {
    await prisma.exam.upsert({
      where: { title: t },
      update: {},
      create: { title: t, durationMinutes: 60 }
    });
  }

  console.log('✅ Seed concluído');
}

main().finally(() => prisma.$disconnect());

