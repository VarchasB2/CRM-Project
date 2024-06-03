import CreateLeadForm from '@/components/tables/Leads/forms/create-lead'
import React from 'react'

const NewLead = () => {
  
  return (
    <div className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-20 md:gap-8  justify-center ">
    <CreateLeadForm/>
    </div>
  )
}

export default NewLead