-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "owner_name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type_of_company" TEXT NOT NULL,
    "funnel_stage" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllContacts" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "lead_id" INTEGER NOT NULL,

    CONSTRAINT "AllContacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_owner_name_fkey" FOREIGN KEY ("owner_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllContacts" ADD CONSTRAINT "AllContacts_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
