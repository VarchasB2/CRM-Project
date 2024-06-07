import db from "@/app/modules/db";
import { NavigationMenuIndicator } from "@radix-ui/react-navigation-menu";
import { Description } from "@radix-ui/react-toast";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import countryList from "react-select-country-list";

export async function POST(req: NextApiRequest) {
	try {
		const data = await req.body;

		const user = await db.user.findMany({
			where: {
				name: data.name,
			},
			select: {
				leads: true,
			},
		});
		const leads = user[0].leads;
		const prettyLeads = leads.map((lead) => {
			const date = new Date(lead.date);
			const readableDate = date.toLocaleString("en-In", {
				dateStyle: "short",
				timeStyle: "short",
			});

			return {
				Description: `  Created On  ${readableDate}, at ${lead.funnel_stage} stage, type ${lead.type_of_company} , ${lead.company_name}, Country ${lead.country} , ${lead.region} .`,
				date: date,
			};
		});
		console.log(prettyLeads);
		return NextResponse.json({ data: prettyLeads });
	} catch (e) {
		console.error(e);
	}
}
