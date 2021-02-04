import { NowRequest, NowResponse } from "@vercel/node";

export default async (request: NowRequest, response: NowResponse) => {
  const r = await fetch(process.env.NEXT_PUBLIC_PRODUCTS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json charset=utf-8",
    },
  });
  const text = await r.json();
  response.status(200).send(text);
};
