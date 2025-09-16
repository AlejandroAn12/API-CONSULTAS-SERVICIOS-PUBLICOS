-- CreateTable
CREATE TABLE "Consumo" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "saldoRestante" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consumo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "EndpointPrecio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
