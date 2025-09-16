-- CreateTable
CREATE TABLE "paypal_orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "approvalUrl" TEXT NOT NULL,
    "captureId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "capturedAt" TIMESTAMP(3),

    CONSTRAINT "paypal_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paypal_orders_orderId_key" ON "paypal_orders"("orderId");
