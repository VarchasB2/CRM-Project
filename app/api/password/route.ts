import db from "@/app/modules/db"

export async function PUT(req:Request){
    try{
        const obj= await req.json()
        const result = await db.user.update({where:{id:obj.user.id},data:{pwd:obj.password}})
        // console.log(obj.user)
        return Response.json(result)
    }catch(error){
        console.log(error)
    }
}