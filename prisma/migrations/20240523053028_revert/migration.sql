/*
  Warnings:

  - You are about to drop the `Contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Leads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contacts" DROP CONSTRAINT "Contacts_id_fkey";

-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_lead_owner_fkey";

-- DropTable
DROP TABLE "Contacts";

-- DropTable
DROP TABLE "Leads";
