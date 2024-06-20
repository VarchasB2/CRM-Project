/*
  Warnings:

  - You are about to drop the column `lead_owner` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `lead_owner` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `lead_owner` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `type_of_company` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[lead_id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lead_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "lead_owner",
ADD COLUMN     "lead_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "date",
DROP COLUMN "lead_owner";

-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "company_name",
DROP COLUMN "date",
DROP COLUMN "lead_owner",
DROP COLUMN "type_of_company";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "admins";

-- CreateTable
CREATE TABLE "_ContactToOpportunity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToOpportunity_AB_unique" ON "_ContactToOpportunity"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToOpportunity_B_index" ON "_ContactToOpportunity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Account_lead_id_key" ON "Account"("lead_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToOpportunity" ADD CONSTRAINT "_ContactToOpportunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToOpportunity" ADD CONSTRAINT "_ContactToOpportunity_B_fkey" FOREIGN KEY ("B") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
