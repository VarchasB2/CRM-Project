export const GET  = async()=>{

}

export const POST = async (req:Request)=>{
    const resBody = await req.json()
    // console.log(resBody)
   return Response.json(resBody)
}