/*
  Warnings:

  - You are about to drop the `_ApiKeyToUsuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuarioId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ApiKeyToUsuario" DROP CONSTRAINT "_ApiKeyToUsuario_A_fkey";

-- DropForeignKey
ALTER TABLE "_ApiKeyToUsuario" DROP CONSTRAINT "_ApiKeyToUsuario_B_fkey";

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ApiKeyToUsuario";

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
