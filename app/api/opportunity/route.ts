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
        return {...opportunity,lead_owner:obj.lead_owner,account_id:obj.account_id, date:obj.date,type_of_company:obj.type_of_company,company_name:obj.company_name };
    })
  
    const result = await db.opportunity.createMany({
        data: opportunities
    })
    return Response.json({ data: {} });
  } catch (error) {
    console.log("error", error);
  }
}
