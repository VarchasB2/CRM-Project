/*
  Warnings:

  - You are about to drop the column `account_data` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `lead_data` on the `History` table. All the data in the column will be lost.
  - Added the required column `changes` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "account_data",
DROP COLUMN "lead_data",
ADD COLUMN     "changes" TEXT NOT NULL;
