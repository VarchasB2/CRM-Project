import db from "@/app/modules/db"

export async function GET(){
    try{
        let first_date = await db.leads.findFirst({
            orderBy:{
                date: 'asc'
            }
        })
        let last_date = await db.leads.findFirst({
            orderBy:{
                date: 'desc'
            }
        })
        return Response.json({data:{first_date,last_date}})
    }catch(error){
        console.log(error)
    }
}