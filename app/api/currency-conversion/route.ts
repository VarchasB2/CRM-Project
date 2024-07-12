import db from "@/app/modules/db";

export async function GET() {
  try {
    const currencyRate = await (
      await fetch(
        "https://api.fxratesapi.com/latest?api_key=fxr_live_2a33a9d58df114eb1c16bcc9b9064f801d6f&base=USD&currencies=INR&resolution=1m&amount=1&places=6&format=json",
        { method: "GET" }
      )
    ).json();
    // const currencyRate='test'
    // (currencyRate);
    const result =await db.currency.create({
        data:{
            rate:currencyRate.rates.INR
        }
    })
    return Response.json(result);
  } catch (error) {
    console.log(error);
  }
}
