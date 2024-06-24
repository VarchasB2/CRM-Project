/*
  Warnings:

  - You are about to drop the column `description` on the `History` table. All the data in the column will be lost.
  - Added the required column `crud` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_data` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "description",
ADD COLUMN     "account_data" JSONB,
ADD COLUMN     "crud" TEXT NOT NULL,
ADD COLUMN     "lead_data" JSONB NOT NULL;
