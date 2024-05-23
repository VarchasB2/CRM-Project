/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "lead_owner" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type_of_company" TEXT NOT NULL,
    "funnel_stage" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leads_lead_owner_key" ON "Leads"("lead_owner");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_lead_owner_fkey" FOREIGN KEY ("lead_owner") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_id_fkey" FOREIGN KEY ("id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
