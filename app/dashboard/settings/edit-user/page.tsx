import db from '@/app/modules/db'
import UserForm from '@/components/settings/user-settings/user-form'
import React from 'react'

const EditUser = async ({searchParams}:{searchParams:any}) => {
    const id = JSON.parse(searchParams.id)
    const obj = await db.user.findUnique({where:{id:id}})
  return (
    <div className="flex flex-1 items-center gap-4 p-4 sm:py-20 md:gap-8  justify-center "><UserForm obj={obj}/></div>
  )
}

export default EditUser