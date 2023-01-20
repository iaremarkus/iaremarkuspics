// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cl = cloudinary.v2;

  cl.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  // b64 encode a string
  const base64 = {
    encode: (str: string) => Buffer.from(str).toString("base64"),
  };

  const requestHeaders = {
    authorization: `Basic ${base64.encode(
      process.env.CLOUDINARY_KEY + ":" + process.env.CLOUDINARY_SECRET
    )}`,
  };
  const folders: any = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD}/folders`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  ).then((result) => {
    console.log(result.json());

    return result;
  });

  const images: any = await cl.search
    .expression("folder:iaremarkuspics/birds")
    .execute()
    .then((result) => result.resources);

  res.status(200).json(folders);
}
