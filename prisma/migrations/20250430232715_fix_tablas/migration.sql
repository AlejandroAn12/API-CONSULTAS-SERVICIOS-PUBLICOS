-- AlterTable
ALTER TABLE "Permiso" ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Rol" ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true;
