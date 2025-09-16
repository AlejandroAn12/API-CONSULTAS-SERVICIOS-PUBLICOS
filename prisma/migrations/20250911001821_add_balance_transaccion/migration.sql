/*
  Warnings:

  - You are about to drop the `ConsumoPeticion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LimitePeticion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Suscripcion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConsumoPeticion" DROP CONSTRAINT "ConsumoPeticion_suscripcionId_fkey";

-- DropForeignKey
ALTER TABLE "LimitePeticion" DROP CONSTRAINT "LimitePeticion_planId_fkey";

-- DropForeignKey
ALTER TABLE "Suscripcion" DROP CONSTRAINT "Suscripcion_planId_fkey";

-- DropForeignKey
ALTER TABLE "Suscripcion" DROP CONSTRAINT "Suscripcion_timeZoneId_fkey";

-- DropForeignKey
ALTER TABLE "Suscripcion" DROP CONSTRAINT "Suscripcion_usuarioId_fkey";

-- DropTable
DROP TABLE "ConsumoPeticion";

-- DropTable
DROP TABLE "LimitePeticion";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "Suscripcion";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletId" TEXT NOT NULL,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndpointPrecio" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EndpointPrecio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_usuarioId_key" ON "Wallet"("usuarioId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
