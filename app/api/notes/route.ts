import db from "@/app/modules/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const result = await db.notes.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        opportunity: {
          include: {
            account: true,
          },
        },
      },
    });
    // const finalResult = result.map(r=>r.opportunity.revenue.toString())
    // return Response.json({data:result})
    const finalResult = result.map((r) => ({
        ...r,
        opportunity: {
          ...r.opportunity,
          revenue: r.opportunity.revenue.toString(), // Convert bigint to string
        },
      }));
  
    // console.log('Result in api',finalResult)
    return Response.json(finalResult)
    // return Response.json({success:true})
  } catch (error) {
    console.log(error);
  }
}
