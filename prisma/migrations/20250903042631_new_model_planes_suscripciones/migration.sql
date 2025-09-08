/*
  Warnings:

  - Added the required column `timeZone` to the `Suscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suscripcion" ADD COLUMN     "timeZone" TEXT NOT NULL;
