import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const data = await req.json();
	console.log(data);
	cookies().set("columnOrder", JSON.stringify(data.columnOrder));
	cookies().set("columnVisibility", JSON.stringify(data.columnVisibility));

	return Response.json({ message: "Hello World" });
}
