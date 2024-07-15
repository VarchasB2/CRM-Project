import db from "@/app/modules/db";
import { supabase } from "@/lib/supabase";
import path from "path";
export async function POST(req: Request) {
  console.log("POST");
  try {
    // const obj = await req.json();
    // if (await db.user.findUnique({ where: { email: obj.email } })) {
    //   throw new Error("User with this email already exists.");
    // }
    // const {data, error} = await supabase.storage.from('images').upload()
    // const result = await db.user.create({
    //   data: {
    //     name: `${obj.first_name} ${obj.last_name}`,
    //     email: obj.email,
    //     role: obj.role,
    //     pwd: obj.password,
    //     image: `/img/${obj.image}`,
    //   },
    // });
    // console.log(obj.image)
    // return Response.json(obj);
    const formData = await req.formData();
    const obj = Object.fromEntries(formData.entries());

    // Check if a user with this email already exists
    // if (await db.user.findUnique({ where: { email: obj.email } })) {
    //   throw new Error("User with this email already exists.");
    // }

    // Handle image upload
    const imageFile = formData.get("image") as File;
    const imagePath = `${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(imagePath, imageFile);

    if (error) {
      throw new Error(error.message);
    }

    const publicURL = supabase.storage.from('images').getPublicUrl(imagePath).data.publicUrl

    const result = await db.user.create({
      data: {
        name: `${obj.first_name} ${obj.last_name}`,
        email: obj.email as string,
        role: obj.role as string,
        pwd: obj.password as string,
        image: publicURL,
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
    return Response.json(result);
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(req: Request) {
  try {
    // const obj = await req.json();
    // console.log("PUT",obj)
    // const result = await db.user.update({
    //   where: { email: obj.email },
    //   data: {
    //     name: `${obj.first_name} ${obj.last_name}`,
    //     email: obj.email,
    //     role: obj.role,
    //     pwd: obj.password,
    //     image: obj.image.startsWith('/img')? obj.image:`/img/${obj.image}`,
    //   },
    // });
    // return Response.json(result);
    const formData = await req.formData();
    const obj = Object.fromEntries(formData.entries());

    // Handle image upload if there's a new file
    let imageUrl = obj.image;
    if (typeof obj.image !== "string") {
      const imageFile = obj.image as File;
      const imagePath = `${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(imagePath, imageFile);

      if (error) {
        throw new Error(error.message);
      }
      
      imageUrl = supabase.storage.from('images').getPublicUrl(imagePath).data.publicUrl
    }

    const result = await db.user.update({
      where: { email: obj.email as string},
      data: {
        name: `${obj.first_name} ${obj.last_name}`,
        email: obj.email as string,
        role: obj.role as string,
        pwd: obj.password as string,
        image: imageUrl as string,
      },
    });

    return Response.json(result);
  } catch (error) {
    console.log(error);
  }
}
