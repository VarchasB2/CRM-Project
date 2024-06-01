import db from "@/app/modules/db";

export async function POST(req: Request) {
  try {
    const obj = await req.json();
    
    
    console.log("Obj.contacts",obj.contacts)
    if (!Array.isArray(obj.contacts)) {
        throw new Error('Contacts must be an array');
    }
    const contacts= obj.contacts.map((contact:any)=>{
        if (typeof contact !== 'object') {
            throw new Error('Each contact must be an object');
        }
        return { ...contact, lead_id: obj.lead_id };
    })
    console.log("Contacts",contacts)
    const result = await db.allContacts.createMany({
        data: contacts
    })

    console.log(obj);
    // const result2 = await db.allContacts.create({
    //     data:{
    //         lead_id:owner!.id,
    //         first_name: obj.contacts.firstName,
    //         last_name: obj.contacts.lastName,
    //         designation: obj.contacts.designation,
    //         email: obj.contacts.email,
    //         phone_number: obj.contacts.phoneNo
    //     }
    // })
    console.log("Result:", result);
    return Response.json({ data: result });
  } catch (error) {
    console.log("error", error);
  }
}
