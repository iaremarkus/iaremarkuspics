// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

type Data = any;

export const getFolders = async () => {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD}/folders/iaremarkuspics`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.CLOUDINARY_KEY + ":" + process.env.CLOUDINARY_SECRET
        ).toString("base64")}`,
      },
    }
  )
    .then((r) => r.json())
    .then((r) => r.folders);

  return response as JSON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { showFolders } = req.query;

  const cl = cloudinary.v2;

  cl.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  const folders: JSON = await getFolders();
  const images: any = await cl.search
    .expression("folder:iaremarkuspics/birds")
    .execute()
    .then((result) => result.resources);

  res.status(200).json(showFolders ? folders : images);
}
