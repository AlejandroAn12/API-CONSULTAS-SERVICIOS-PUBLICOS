/*
  Warnings:

  - Made the column `nombre` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "permisos" ADD COLUMN     "descripcion" TEXT;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "descripcion" TEXT,
ALTER COLUMN "nombre" SET NOT NULL;
