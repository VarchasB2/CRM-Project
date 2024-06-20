import db from '@/app/modules/db';
import { columns } from '@/components/tables/Leads/columns';
import { LeadsTable } from '@/components/tables/Leads/leads-table';


import React from 'react'
export async function getLeads() {
    const data = await db.leads.findMany({
      relationLoadStrategy: "join",
      include: {
        lead_owner: true,
        contacts:true
      },
      orderBy:{
        id:'asc'
      }
    });
    return data;
  }
const LeadsPage = async () => {
const data = await getLeads();
const today:Date = new Date()
// console.log(data[0].date,data[data.length-1].date)
// console.log(data)
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8">

      <LeadsTable columns={columns} data={data} firstDate={data.length===0?today:data[0].date} lastDate={data.length===0?today:data[data.length-1].date}/>
    </div>
  )
}

export default LeadsPage