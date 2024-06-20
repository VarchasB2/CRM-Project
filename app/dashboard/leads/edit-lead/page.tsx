import db from "@/app/modules/db";
import CreateLeadForm from "@/components/tables/Leads/forms/create-lead";
import React from "react";

const EditLead = async ({searchParams}:{searchParams:any}) => {
  // console.log(JSON.parse(searchParams.row))
  const id = JSON.parse(searchParams.id)
  // console.log(obj.original)
  console.log(id)
  const obj = await db.leads.findUnique({
    where:{
      id: parseInt(id!)
    },
    include:{
      lead_owner:true,
      contacts:true,
      account:{
        include:{
          opportunities:{
            include:{
              contact:true
            }
          }
        }
      }
    }
  })
  // console.log(obj?.account?.opportunities[0].contact)
  return (
    <div className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-20 md:gap-8  justify-center ">
      <CreateLeadForm obj={obj}/>
      
    </div>
  );
};

export default EditLead;
