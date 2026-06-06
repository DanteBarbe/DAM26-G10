/**
 * seed de desarrollo — crea un usuario demo y materiales de prueba.
 * Correr con: npx tsx prisma/seed.ts
 */
import 'dotenv/config';
import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('demo1234', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@utnotas.com' },
    update: {},
    create: {
      email: 'demo@utnotas.com',
      username: 'demo.user',
      name: 'Demo',
      surname: 'User',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('Usuario creado:', user.email, '/ id:', user.id);

  const PDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  await prisma.material.createMany({
    skipDuplicates: true,
    data: [
      {
        titulo: 'Resumen Análisis Matemático II',
        tipo: 'RESUMEN',
        archivo: PDF,
        descripcion: 'Límites, integrales impropias, series y ejercicios típicos de final.',
        comision: 'S2',
        añoCursada: 2025,
        userId: user.id,
      },
      {
        titulo: 'Parcial resuelto Base de Datos — 2do parcial',
        tipo: 'PARCIAL_RESUELTO',
        archivo: PDF,
        descripcion: 'MER, normalización hasta 3FN y consultas SQL.',
        comision: 'S3',
        añoCursada: 2024,
        numeroParcial: 2,
        userId: user.id,
      },
      {
        titulo: 'Guía práctica Física I',
        tipo: 'PRACTICA',
        archivo: PDF,
        descripcion: 'Cinemática, dinámica y trabajo-energía con notas al margen.',
        comision: 'I1',
        añoCursada: 2025,
        userId: user.id,
      },
      {
        titulo: 'Apunte Paradigmas de Programación',
        tipo: 'APUNTE',
        archivo: PDF,
        descripcion: 'Objetos, funcional y lógico con ejemplos en Haskell y Prolog.',
        comision: 'S1',
        añoCursada: 2024,
        userId: user.id,
      },
    ],
  });

  console.log('Materiales creados. Listo.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
