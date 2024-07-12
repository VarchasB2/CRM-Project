import db from "@/app/modules/db";
import CreateLeadForm from "@/components/tables/Leads/forms/create-lead";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const EditLead = async ({searchParams}:{searchParams:any}) => {
  const id = JSON.parse(searchParams.id)
  const obj = await db.leads.findUnique({
    where:{
      id: parseInt(id!),
      deletedAt:null
    },
    include:{
      lead_owner:true,
      contacts:{
        orderBy:{
          id:'asc'
        }
      },
      account:{
        include:{
          contacts:true,
          opportunities:{
            include:{
              contact:true,
              notes:true
            }
          }
        }
      }
    }
  })
  const session = await getServerSession(authOptions)
  const users = await db.user.findMany({
    where: {
      role: "user",
      deletedAt:null
    },
    select: {
      name: true,
    },
  });
  const userNames = users.map((user) => ({
    label: user.name,
    value: user.name
  }));
  return (
    <div className="testxl:grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-20 md:gap-8  justify-center ">
      <CreateLeadForm obj={obj} currentUser={session?.user.username!} users={userNames} />
      
    </div>
  );
};

export default EditLead;
