import React from 'react'
import { TabsContent } from '../../ui/tabs'
import { UserDataTable } from './user-table'
import { columns } from './columns'
import db from '@/app/modules/db'

const UserSettings = async () => {
  const data = await db.user.findMany({where:{deletedAt:null}})
  // console.log(data)
  return (
    <TabsContent value="users">
      {/* <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 "> */}
      <UserDataTable columns={columns} data={data}/>
      {/* </div> */}
      </TabsContent>
  )
}

export default UserSettings