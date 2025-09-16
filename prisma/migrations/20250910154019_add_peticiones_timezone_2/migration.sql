/*
  Warnings:

  - You are about to drop the column `peticionId` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the `Peticiones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_peticionId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "peticionId";

-- DropTable
DROP TABLE "Peticiones";

-- CreateTable
CREATE TABLE "LimitePeticion" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "maximo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "LimitePeticion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumoPeticion" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "usado" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "suscripcionId" TEXT NOT NULL,

    CONSTRAINT "ConsumoPeticion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LimitePeticion" ADD CONSTRAINT "LimitePeticion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoPeticion" ADD CONSTRAINT "ConsumoPeticion_suscripcionId_fkey" FOREIGN KEY ("suscripcionId") REFERENCES "Suscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
