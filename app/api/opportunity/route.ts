import db from "@/app/modules/db";

export async function POST(req: Request) {
  try {
    const obj = await req.json();
    
    

    if (!Array.isArray(obj.opportunities)) {
        throw new Error('Opportunities must be an array');
    }
    const opportunities= obj.opportunities.map((opportunity:any)=>{
        if (typeof opportunity !== 'object') {
            throw new Error('Each opportunity must be an object');
        }
        console.log("contact",opportunity)
        return {...opportunity,account_id:obj.account_id };
    })
  
    const result = await db.opportunity.createMany({
        data: opportunities
    })
    return Response.json({ data: {} });
  } catch (error) {
    console.log("error", error);
  }
}
