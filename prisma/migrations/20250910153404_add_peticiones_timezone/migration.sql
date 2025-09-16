/*
  Warnings:

  - You are about to drop the column `timeZone` on the `Suscripcion` table. All the data in the column will be lost.
  - Added the required column `peticionId` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeZoneId` to the `Suscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "peticionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Suscripcion" DROP COLUMN "timeZone",
ADD COLUMN     "timeZoneId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Peticiones" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peticiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timezone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timezone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timezone_name_key" ON "Timezone"("name");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_peticionId_fkey" FOREIGN KEY ("peticionId") REFERENCES "Peticiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_timeZoneId_fkey" FOREIGN KEY ("timeZoneId") REFERENCES "Timezone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
