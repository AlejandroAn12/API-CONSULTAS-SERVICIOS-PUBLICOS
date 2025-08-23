/*
  Warnings:

  - The primary key for the `ApiKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activo` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `ApiKey` table. All the data in the column will be lost.
  - The `id` column on the `ApiKey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `system` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_usuarioId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_pkey",
DROP COLUMN "activo",
DROP COLUMN "creadoEn",
DROP COLUMN "usuarioId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "system" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_ApiKeyToUsuario" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ApiKeyToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ApiKeyToUsuario_B_index" ON "_ApiKeyToUsuario"("B");

-- AddForeignKey
ALTER TABLE "_ApiKeyToUsuario" ADD CONSTRAINT "_ApiKeyToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApiKeyToUsuario" ADD CONSTRAINT "_ApiKeyToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
