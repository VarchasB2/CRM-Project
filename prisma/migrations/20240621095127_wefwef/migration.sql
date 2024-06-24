/*
  Warnings:

  - The `account_data` column on the `History` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `lead_data` on the `History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "account_data",
ADD COLUMN     "account_data" JSONB,
DROP COLUMN "lead_data",
ADD COLUMN     "lead_data" JSONB NOT NULL;
