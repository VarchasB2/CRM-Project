import db from "@/app/modules/db";

export async function POST(req: Request) {
  try {
    const obj = await req.json();
    
    

    if (!Array.isArray(obj.contacts)) {
        throw new Error('Contacts must be an array');
    }
    const contacts= obj.contacts.map((contact:any)=>{
        if (typeof contact !== 'object') {
            throw new Error('Each contact must be an object');
        }
        return { ...contact, lead_id: obj.lead_id };
    })

    const result = await db.allContacts.createMany({
        data: contacts
    })
    return Response.json({ data: result });
  } catch (error) {
    console.log("error", error);
  }
}

export async function PUT(req:Request){
  try{
    const obj = await req.json();
    
    if (!Array.isArray(obj.contacts)) {
      throw new Error('Contacts must be an array');
  }
  const contactIDs = await db.allContacts.findMany({
    where:{
      lead_id:obj.lead_id
    },
  })
  console.log("OBJ CONTACTS",obj.contacts)
  console.log('ORIGINAL CONTACTS',obj.org.contacts)
  // if(obj.contacts.length<obj.org.contacts.length){
  //   //FIGURE IT OUT LATER
  // }
  const contacts= obj.contacts.map((contact:any,index:number)=>{
      if (typeof contact !== 'object') {
          throw new Error('Each contact must be an object');
      }
      return { ...contact, lead_id: obj.lead_id,id:obj.org.contacts[index].id};
  })
  console.log(contacts)
  // console.log(obj.contacts)
  // const result = await db.allContacts.updateMany({
  //   where:{
  //     lead_id: obj.lead_id
  //   },
  //   data:contacts
  // })
  
  const results = await contacts.map(async (contact:any)=>{
    const result = await db.allContacts.upsert({
      where:{
        id:contact.id
      },
      update:contact,
      create:contact
    })
    const test = await Promise.all(results)
    console.log("SADJADSJ;LKASDFJL;ASF;LJKASFJL;FAS;JLK",test)
    return test
  })
  // const results = Promise.all(contacts.map((contact:any)=>{
  //   const result = db.allContacts.update({
  //     where:{
  //       lead_id: obj.lead_id
  //     },
  //     data:contacts
  //   })
  // }))
  return Response.json({ data: {} });
  }catch(error){
    console.log(error)
  }
}