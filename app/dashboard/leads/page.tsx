import db from '@/app/modules/db';
import { columns, Leads } from '@/components/tables/Leads/columns';
import { DataTable } from '@/components/tables/Leads/data-table';

import React from 'react'
async function getLeads(): Promise<Leads[]> {
    const data = await db.leads.findMany({
      relationLoadStrategy: "join",
      include: {
        lead_owner: true,
        contacts:true
      },
    });
    return data;
  }
const LeadsPage = async () => {
const data = await getLeads();
// console.log(data)
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">

      <DataTable columns={columns} data={data}/>
    </div>
  )
}

export default LeadsPage