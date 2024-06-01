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
    // console.log(obj)
    const owner = await db.user.findUnique({
      where: { name: obj.leadOwner },
    });
    const result = await db.leads.create({
      data: {
        owner_id: owner!.id,
        type_of_company: obj.type_of_company,
        funnel_stage: obj.funnel_stage,
        company_name: obj.company_name,
        region: obj.region,
        country: countryList().getLabel(obj.country),
      },
    });
    console.log(result);
    const contactResponse = await fetch(
      "http://localhost:3000/api/all-contacts",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...obj,lead_id: result.id}),
      }
    );
    // console.log(obj)
    // const result2 = await db.allContacts.create({
    //     data:{
    //         lead_id:owner!.id,
    //         first_name: obj.contacts.firstName,
    //         last_name: obj.contacts.lastName,
    //         designation: obj.contacts.designation,
    //         email: obj.contacts.email,
    //         phone_number: obj.contacts.phoneNo
    //     }
    // })

    return Response.json({ data: result });
  } catch (error) {
    console.log("error", error);
  }
}
// export async function GET(){
//     try{
//         const owner = await db.user.findUnique({
//             where: {
//                 name: 'Palak'
//             }
//         })
//       return Response.json(owner)
//     }catch(error){
//         console.log("error",error)
//     }
// }
