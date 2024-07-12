import db from "@/app/modules/db";
export async function PUT(req:Request){
    try{
        const obj= await req.json()
        const result = await db.user.update({
            where:{
                id:obj.id
            },
            data:{
                status: obj.status==='active'?'blocked':'active'
            }
        })
        console.log(result)
        return Response.json(result)
    }catch(error){
        console.log(error)
    }
} 