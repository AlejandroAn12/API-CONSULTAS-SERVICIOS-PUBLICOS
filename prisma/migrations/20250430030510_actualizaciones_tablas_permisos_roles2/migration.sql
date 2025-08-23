/*
  Warnings:

  - Made the column `nombres` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "nombres" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
