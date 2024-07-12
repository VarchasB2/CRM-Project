/*
  Warnings:

  - You are about to drop the column `description` on the `Opportunity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "description",
ADD COLUMN     "notes" JSONB[];
