import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AllContacts } from "@prisma/client";
import React from "react";

const ContactRow = ({
  contacts,
  field,
}: {
  contacts: AllContacts[];
  field: any;
}) => {
return(
    <div >
        {contacts.map((row:any)=>{
            return <div key={row.id} className="p-1">
                {row[field]}
            </div>
        })}
    </div>

)
};

export default ContactRow;
