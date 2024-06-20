import db from '@/app/modules/db'
import { columns } from '@/components/tables/funnel-lookup/columns'
import { FunnelLookupTable } from '@/components/tables/funnel-lookup/funnel-lookup-table'

import React from 'react'

const FunnelLookup = async () => {
    const data = await db.account.findMany({
      include:{
        lead:{
          select:{
            lead_owner:true
          }
        }
      }
    })
    const today:Date = new Date()
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">

    {/* <DataTable columns={columns} data={data} colOrder={['SI','lead_owner','date','type_of_company','funnel_stage','company_name','progress','closure_due_date','days_overdue']}/> */}
    <FunnelLookupTable columns={columns} data={data} firstDate={data.length===0?today:data[0].date} lastDate={data.length===0?today:data[data.length-1].date}/>
  </div>)
}

export default FunnelLookup