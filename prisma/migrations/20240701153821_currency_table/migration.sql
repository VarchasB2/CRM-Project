-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);
