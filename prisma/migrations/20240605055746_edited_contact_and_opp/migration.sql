/*
  Warnings:

  - You are about to drop the column `date` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `lead_owner` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `lead_owner` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `type_of_company` on the `Opportunity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "date",
DROP COLUMN "lead_owner";

-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "company_name",
DROP COLUMN "date",
DROP COLUMN "lead_owner",
DROP COLUMN "type_of_company";
