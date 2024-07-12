import db from "@/app/modules/db";
import path from "path";
export async function POST(req: Request) {
  console.log("POST");
  try {
    const obj = await req.json();
    if (await db.user.findUnique({ where: { email: obj.email } })) {
      throw new Error("User with this email already exists.");
    }
    const result = await db.user.create({
      data: {
        name: `${obj.first_name} ${obj.last_name}`,
        email: obj.email,
        role: obj.role,
        pwd: obj.password,
        image: `/img/${obj.image}`,
      },
    });
    return Response.json(result);
  } catch (error) {
    console.log(error);
  }
}
export async function DELETE(req: Request) {
  try {
    const obj = await req.json();
    const result = await db.user.update({
      where: {
        id: obj,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return Response.json(obj);
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(req: Request) {
  try {
    const obj = await req.json();
    console.log("PUT",obj)
    const result = await db.user.update({
      where: { email: obj.email },
      data: {
        name: `${obj.first_name} ${obj.last_name}`,
        email: obj.email,
        role: obj.role,
        pwd: obj.password,
        image: obj.image.startsWith('/img')? obj.image:`/img/${obj.image}`,
      },
    });
    return Response.json(result);
  } catch (error) {
    console.log(error);
  }
}
