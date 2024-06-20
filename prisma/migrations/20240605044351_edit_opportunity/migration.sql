/*
  Warnings:

  - Added the required column `company_name` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_owner` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_of_company` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "company_name" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lead_owner" TEXT NOT NULL,
ADD COLUMN     "type_of_company" TEXT NOT NULL;
