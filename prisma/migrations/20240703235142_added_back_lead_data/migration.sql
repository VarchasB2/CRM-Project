/*
  Warnings:

  - Added the required column `lead_data` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" ADD COLUMN     "lead_data" JSONB NOT NULL;
