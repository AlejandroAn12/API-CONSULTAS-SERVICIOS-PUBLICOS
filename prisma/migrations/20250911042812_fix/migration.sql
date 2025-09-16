/*
  Warnings:

  - You are about to drop the `Permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolesPermisos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolesPermisos" DROP CONSTRAINT "RolesPermisos_permisoId_fkey";

-- DropForeignKey
ALTER TABLE "RolesPermisos" DROP CONSTRAINT "RolesPermisos_rolId_fkey";

-- DropTable
DROP TABLE "Permiso";

-- DropTable
DROP TABLE "RolesPermisos";
