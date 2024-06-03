import db from "@/app/modules/db";
import { NavigationMenuIndicator } from "@radix-ui/react-navigation-menu";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import countryList from "react-select-country-list";

type Params = {
  name: string;
};

export async function POST(req: Request) {
  try {
    const obj = await req.json();
    const owner = await db.user.findUnique({
      where: { name: obj.leadOwner },
    });
    const lead = await db.leads.create({
      data: {
        owner_id: owner!.id,
        type_of_company: obj.type_of_company,
        funnel_stage: obj.funnel_stage,
        company_name: obj.company_name,
        region: obj.region,
        country: countryList().getLabel(obj.country),
      },
    });
    const contactResponse = await fetch(
      "http://localhost:3000/api/all-contacts",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...obj,lead_id: lead.id}),
      }
    );
    if(obj.opportunities.length>0){
      const account = await db.account.create({
        data:{
          lead_owner: owner!.name,
          date: lead.date,
          type_of_company: lead.type_of_company,
          funnel_stage: lead.funnel_stage,
          company_name: lead.company_name,
          region: lead.region,
          country: lead.country
        }
      })
      const contact = await fetch(
        "http://localhost:3000/api/contacts",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({lead_owner:account.lead_owner,date:account.date,...obj,account_id:account.id}),
        }
      );
      const opportunity = await fetch(
        "http://localhost:3000/api/opportunity",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...obj,account_id:account.id}),
        }
      );
    }
    return Response.json({ data: lead });
  } catch (error) {
    console.log("error", error);
  }
}