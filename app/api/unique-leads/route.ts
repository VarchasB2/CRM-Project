import db from "@/app/modules/db"

export async function POST(req:Request){
    try{
        const obj = await req.json()
        const emails = obj.contacts.map((contact:any)=>contact.email)
        const checkCompany = await db.leads.findMany({
            where:{
                company_name: obj.company_name,
                deletedAt:null
            }
        })
        const checkContact = await db.allContacts.findMany({
            where:{
                email:{in: emails},
                deletedAt:null
            }
        })
        const checkAll = await Promise.all([checkCompany,checkContact])
        return Response.json(checkAll)
    }catch(error){
        console.log(error)
    }
}