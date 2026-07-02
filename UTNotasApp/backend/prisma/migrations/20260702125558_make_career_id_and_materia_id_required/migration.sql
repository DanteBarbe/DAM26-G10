/*
  Warnings:

  - Made the column `materiaId` on table `materials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `careerId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- Rellenar NULL antes de hacer NOT NULL
UPDATE "materials" SET "materiaId" = 3 WHERE "materiaId" IS NULL;
UPDATE "users" SET "careerId" = 1 WHERE "careerId" IS NULL;

-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_materiaId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_careerId_fkey";

-- AlterTable
ALTER TABLE "materials" ALTER COLUMN "materiaId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "careerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "carreras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "materias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
