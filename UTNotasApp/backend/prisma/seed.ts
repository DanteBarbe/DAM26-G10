import 'dotenv/config';
import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';

/**
 * Seed del catalogo academico.
 *
 * - Carreras: se mantienen estables id 1 (Sistemas) y 3 (Civil) para no romper
 *   materiales/usuarios ya existentes.
 * - Materias: se mantienen estables los ids 1-5 (ya en uso). Las nuevas van 6+.
 *   Las "basicas" pertenecen a TODAS las carreras; las "especificas" a una sola.
 */
async function main() {
  // 1. Carreras (id estable)
  const carrerasData = [
    { id: 1, nombre: 'Ingeniería en Sistemas de Información', icon: 'cpu' },
    { id: 2, nombre: 'Ingeniería Industrial', icon: 'trending-up' },
    { id: 3, nombre: 'Ingeniería Civil', icon: 'home' },
    { id: 4, nombre: 'Ingeniería Eléctrica', icon: 'zap' },
    { id: 5, nombre: 'Ingeniería Mecánica', icon: 'settings' },
    { id: 6, nombre: 'Ingeniería Química', icon: 'droplet' },
  ];
  for (const c of carrerasData) {
    await prisma.carrera.upsert({
      where: { id: c.id },
      update: { nombre: c.nombre, icon: c.icon },
      create: c,
    });
  }

  // 2. Materias basicas: comunes a TODAS las carreras. anio = año en que se cursan.
  const basicas = [
    { id: 1, nombre: 'Análisis Matemático I', descripcion: 'Límites, derivadas e integrales de una variable.', anio: 1 },
    { id: 2, nombre: 'Análisis Matemático II', descripcion: 'Integrales múltiples, series y ecuaciones diferenciales.', anio: 2 },
    { id: 4, nombre: 'Física I', descripcion: 'Mecánica clásica, trabajo y energía.', anio: 1 },
    { id: 6, nombre: 'Álgebra y Geometría Analítica', descripcion: 'Matrices, vectores, cónicas y sistemas lineales.', anio: 1 },
    { id: 7, nombre: 'Química General', descripcion: 'Estructura atómica, enlaces y estequiometría.', anio: 1 },
    { id: 8, nombre: 'Física II', descripcion: 'Electromagnetismo, ondas y óptica.', anio: 2 },
    { id: 9, nombre: 'Probabilidad y Estadística', descripcion: 'Modelos probabilísticos e inferencia.', anio: 2 },
  ];

  // 3. Materias especificas: pertenecen a UNA carrera (carreraId).
  const especificas = [
    // Ingeniería en Sistemas de Información (1)
    { id: 3, nombre: 'Base de Datos', descripcion: 'Modelo relacional, SQL y normalización.', carreraId: 1, anio: 3 },
    { id: 5, nombre: 'Paradigmas de Programación', descripcion: 'Objetos, funcional y lógico.', carreraId: 1, anio: 2 },
    { id: 10, nombre: 'Algoritmos y Estructuras de Datos', descripcion: 'Complejidad, estructuras lineales y árboles.', carreraId: 1, anio: 1 },
    { id: 11, nombre: 'Diseño de Sistemas', descripcion: 'Análisis y diseño orientado a objetos.', carreraId: 1, anio: 3 },
    // Ingeniería Industrial (2)
    { id: 12, nombre: 'Administración General', descripcion: 'Organizaciones, planeamiento y gestión.', carreraId: 2, anio: 2 },
    { id: 13, nombre: 'Investigación Operativa', descripcion: 'Optimización, programación lineal y colas.', carreraId: 2, anio: 3 },
    // Ingeniería Civil (3)
    { id: 20, nombre: 'Estabilidad', descripcion: 'Estática de estructuras y esfuerzos.', carreraId: 3, anio: 2 },
    { id: 21, nombre: 'Hidráulica General', descripcion: 'Escurrimiento y obras hidráulicas.', carreraId: 3, anio: 3 },
    // Ingeniería Eléctrica (4)
    { id: 14, nombre: 'Circuitos Eléctricos', descripcion: 'Análisis de circuitos en CC y CA.', carreraId: 4, anio: 2 },
    { id: 15, nombre: 'Máquinas Eléctricas', descripcion: 'Transformadores y motores.', carreraId: 4, anio: 3 },
    // Ingeniería Mecánica (5)
    { id: 16, nombre: 'Termodinámica', descripcion: 'Ciclos, calor y trabajo.', carreraId: 5, anio: 2 },
    { id: 17, nombre: 'Mecánica de los Fluidos', descripcion: 'Estática y dinámica de fluidos.', carreraId: 5, anio: 3 },
    // Ingeniería Química (6)
    { id: 18, nombre: 'Química Orgánica', descripcion: 'Estructura y reacciones del carbono.', carreraId: 6, anio: 2 },
    { id: 19, nombre: 'Operaciones Unitarias', descripcion: 'Transferencia de masa y energía en procesos.', carreraId: 6, anio: 3 },
  ];

  for (const m of [...basicas, ...especificas]) {
    await prisma.materia.upsert({
      where: { id: m.id },
      update: { nombre: m.nombre, descripcion: m.descripcion },
      create: { id: m.id, nombre: m.nombre, descripcion: m.descripcion },
    });
  }

  console.log(`Carreras: ${carrerasData.length} | Materias: ${basicas.length + especificas.length}`);

  // 4. CarreraMateria: basicas -> todas las carreras; especificas -> su carrera.
  const relaciones: { carreraId: number; materiaId: number; anio: number }[] = [];
  for (const b of basicas) {
    for (const c of carrerasData) {
      relaciones.push({ carreraId: c.id, materiaId: b.id, anio: b.anio });
    }
  }
  for (const e of especificas) {
    relaciones.push({ carreraId: e.carreraId, materiaId: e.id, anio: e.anio });
  }
  await prisma.carreraMateria.createMany({ data: relaciones, skipDuplicates: true });

  console.log(`CarreraMateria: ${relaciones.length} relaciones.`);

  // 5. Usuario demo
  const hashedPassword = await bcrypt.hash('demo1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@utnotas.com' },
    update: { careerId: 1 },
    create: {
      email: 'demo@utnotas.com',
      username: 'demo.user',
      name: 'Demo',
      surname: 'User',
      password: hashedPassword,
      role: 'USER',
      careerId: 1,
    },
  });

  // 6. Materiales demo (se regeneran de cero para que sea idempotente)
  const PDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  await prisma.material.deleteMany({ where: { userId: user.id } });
  await prisma.material.createMany({
    data: [
      { titulo: 'Resumen Análisis Matemático II', tipo: 'RESUMEN', archivo: PDF, descripcion: 'Series, integrales impropias y ejercicios de final.', comision: 'S2', añoCursada: 2025, userId: user.id, materiaId: 2, carreraId: 1 },
      { titulo: 'Parcial resuelto Base de Datos — 2do parcial', tipo: 'PARCIAL_RESUELTO', archivo: PDF, descripcion: 'MER, normalización hasta 3FN y consultas SQL.', comision: 'S3', añoCursada: 2024, numeroParcial: 2, userId: user.id, materiaId: 3, carreraId: 1 },
      { titulo: 'Guía práctica Física I', tipo: 'PRACTICA', archivo: PDF, descripcion: 'Cinemática, dinámica y trabajo-energía.', comision: 'S1', añoCursada: 2025, userId: user.id, materiaId: 4, carreraId: 1 },
    ],
  });

  console.log('Usuario y materiales demo listos. Seed OK.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
