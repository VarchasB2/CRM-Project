-- DropForeignKey
ALTER TABLE "AllContacts" DROP CONSTRAINT "AllContacts_lead_id_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_account_id_fkey";

-- CreateTable
CREATE TABLE "_AllContactsToLeads" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AccountToContact" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AllContactsToLeads_AB_unique" ON "_AllContactsToLeads"("A", "B");

-- CreateIndex
CREATE INDEX "_AllContactsToLeads_B_index" ON "_AllContactsToLeads"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToContact_AB_unique" ON "_AccountToContact"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToContact_B_index" ON "_AccountToContact"("B");

-- AddForeignKey
ALTER TABLE "_AllContactsToLeads" ADD CONSTRAINT "_AllContactsToLeads_A_fkey" FOREIGN KEY ("A") REFERENCES "AllContacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllContactsToLeads" ADD CONSTRAINT "_AllContactsToLeads_B_fkey" FOREIGN KEY ("B") REFERENCES "Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToContact" ADD CONSTRAINT "_AccountToContact_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToContact" ADD CONSTRAINT "_AccountToContact_B_fkey" FOREIGN KEY ("B") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
