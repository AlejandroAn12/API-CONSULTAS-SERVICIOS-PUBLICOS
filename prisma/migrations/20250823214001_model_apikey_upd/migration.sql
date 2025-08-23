/*
  Warnings:

  - You are about to drop the `UsuarioRol` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_rolId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "roleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UsuarioRol";

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
