import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const data = [
    //Leads
//   {
//     owner_id: 1,
//     type_of_company: "Technology Services - Large",
//     funnel_stage: "Engaged / Discovery",
//     company_name: "Stellar Solutions",
//     region: "Americas",
//     country: "Brazil",
//   },
  
    //All Contacts
    {
        first_name: "Claire",
        last_name: "Anderson",
        designation: "CFO",
        email: "claire.anderson@example.com",
        phone_number: "+65 9876 5432",
        lead_id: 6
    },
    {
        first_name: "James",
        last_name: "White",
        designation: "VP Marketing",
        email: "james.white@example.com",
        phone_number: "+52 55 5555 5555",
        lead_id: 7
    },
    {
        first_name: "Ethan",
        last_name: "King",
        designation: "IT Director",
        email: "ethan.king@example.com",
        phone_number: "+55 11 1234 5678",
        lead_id: 8
    },
    {
        first_name: "Mia",
        last_name: "Hernandez",
        designation: "Marketing Manager",
        email: "mia.hernandez@example.com",
        phone_number: "+61 2 9876 5432",
        lead_id: 9
    },
    {
        first_name: "Noah",
        last_name: "Scott",
        designation: "Operations Manager",
        email: "noah.scott@example.com",
        phone_number: "+33 1 1234 5678",
        lead_id: 10
    },
    {
        first_name: "Logan",
        last_name: "Roberts",
        designation: "Marketing Director",
        email: "logan.roberts@example.com",
        phone_number: "+1 (555) 345-6789",
        lead_id: 11
    },
    {
        first_name: "Harper",
        last_name: "Hall",
        designation: "IT Manager",
        email: "harper.hall@example.com",
        phone_number: "+974 55 123 4567",
        lead_id: 12
    },
    {
        first_name: "David",
        last_name: "Martinez",
        designation: "COO",
        email: "david.martinez@example.com",
        phone_number: "+1 (555) 987-6543",
        lead_id: 13
    },
    {
        first_name: "Emma",
        last_name: "Thompson",
        designation: "Head of Sales",
        email: "emma.thompson@example.com",
        phone_number: "+971 50 123 4567",
        lead_id: 14
    },
    {
        first_name: "Sophia",
        last_name: "Nguyen",
        designation: "HR Manager",
        email: "sophia.nguyen@example.com",
        phone_number: "+49 1234 567890",
        lead_id: 15
    },
    {
        first_name: "Liam",
        last_name: "Perez",
        designation: "Product Manager",
        email: "liam.perez@example.com",
        phone_number: "+1 (555) 234-5678",
        lead_id: 16
    },
    {
        first_name: "Zoe",
        last_name: "Rivera",
        designation: "Sales Manager",
        email: "zoe.rivera@example.com",
        phone_number: "+966 50 123 4567",
        lead_id: 17
    },
];

async function main() {
    // await prisma.leads.createMany({data})
    await prisma.allContacts.createMany({data})
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
