import 'dotenv/config';
import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  // 1. Carreras
  const sistemas = await prisma.carrera.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: 'Ingeniería en Sistemas de Información', icon: 'laptop' },
  });
  const electronica = await prisma.carrera.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: 'Ingeniería Electrónica', icon: 'cpu' },
  });
  const civil = await prisma.carrera.upsert({
    where: { id: 3 },
    update: {},
    create: { nombre: 'Ingeniería Civil', icon: 'building' },
  });

  console.log('Carreras creadas:', sistemas.id, electronica.id, civil.id);

  // 2. Materias
  const analitica1 = await prisma.materia.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: 'Análisis Matemático I', descripcion: 'Límites, derivadas e integrales.' },
  });
  const analitica2 = await prisma.materia.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: 'Análisis Matemático II', descripcion: 'Integrales múltiples y series.' },
  });
  const baseDatos = await prisma.materia.upsert({
    where: { id: 3 },
    update: {},
    create: { nombre: 'Base de Datos', descripcion: 'Modelado relacional, SQL y normalización.' },
  });
  const fisica1 = await prisma.materia.upsert({
    where: { id: 4 },
    update: {},
    create: { nombre: 'Física I', descripcion: 'Mecánica clásica y termodinámica.' },
  });
  const paradigmas = await prisma.materia.upsert({
    where: { id: 5 },
    update: {},
    create: { nombre: 'Paradigmas de Programación', descripcion: 'OOP, funcional y lógico.' },
  });

  console.log('Materias creadas.');

  // 3. CarreraMateria
  await prisma.carreraMateria.createMany({
    skipDuplicates: true,
    data: [
      { carreraId: sistemas.id, materiaId: analitica1.id, anio: 1 },
      { carreraId: sistemas.id, materiaId: analitica2.id, anio: 2 },
      { carreraId: sistemas.id, materiaId: baseDatos.id,  anio: 3 },
      { carreraId: sistemas.id, materiaId: fisica1.id,    anio: 1 },
      { carreraId: sistemas.id, materiaId: paradigmas.id, anio: 2 },
      { carreraId: electronica.id, materiaId: analitica1.id, anio: 1 },
      { carreraId: electronica.id, materiaId: fisica1.id,    anio: 1 },
      { carreraId: civil.id, materiaId: analitica1.id, anio: 1 },
      { carreraId: civil.id, materiaId: fisica1.id,    anio: 1 },
    ],
  });

  console.log('CarreraMateria creada.');

  // 4. Usuario demo
  const hashedPassword = await bcrypt.hash('demo1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@utnotas.com' },
    update: { careerId: sistemas.id },
    create: {
      email: 'demo@utnotas.com',
      username: 'demo.user',
      name: 'Demo',
      surname: 'User',
      password: hashedPassword,
      role: 'USER',
      careerId: sistemas.id,
    },
  });

  console.log('Usuario creado:', user.email, '/ id:', user.id);

  // 5. Materiales demo
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
        materiaId: analitica2.id,
        carreraId: sistemas.id,
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
        materiaId: baseDatos.id,
        carreraId: sistemas.id,
      },
      {
        titulo: 'Guía práctica Física I',
        tipo: 'PRACTICA',
        archivo: PDF,
        descripcion: 'Cinemática, dinámica y trabajo-energía con notas al margen.',
        comision: 'I1',
        añoCursada: 2025,
        userId: user.id,
        materiaId: fisica1.id,
        carreraId: sistemas.id,
      },
      {
        titulo: 'Apunte Paradigmas de Programación',
        tipo: 'APUNTE',
        archivo: PDF,
        descripcion: 'Objetos, funcional y lógico con ejemplos en Haskell y Prolog.',
        comision: 'S1',
        añoCursada: 2024,
        userId: user.id,
        materiaId: paradigmas.id,
        carreraId: sistemas.id,
      },
    ],
  });

  console.log('Materiales creados. Listo.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
