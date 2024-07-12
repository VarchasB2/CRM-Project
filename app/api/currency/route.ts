import db from "@/app/modules/db"

export async function GET(){
    try{
        const currentRate = await db.currency.findFirst({
            select:{
                rate:true
            },
            orderBy:{
                id:'desc'
            }
        })
        return Response.json(currentRate)
    }catch(error){
        console.log(error)
    }
}