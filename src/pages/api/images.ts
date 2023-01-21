// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Folder, Image } from "@/models/types";
import cloudinary from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export const getFolders = async () => {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD}/folders/iaremarkuspics`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_KEY + ":" + process.env.CLOUDINARY_SECRET).toString(
          "base64"
        )}`
      }
    }
  );

  const json = await response.json();

  const foldersPromise = await Promise.allSettled(
    json.folders.map(async (f: Folder) => {
      const featured = await getImages(f.name, 1);
      return { featured: featured[0].url, ...f };
    })
  );

  const folders = foldersPromise.map((f: any) => f.value);

  return folders as Folder[];
};

export const getImages = async (folder: string, count: number = 300) => {
  const cl = cloudinary.v2;

  cl.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  const results = await cl.search
    .expression(`folder:iaremarkuspics/${folder}`)
    .max_results(count || 500)
    .execute()
    .then(result => result.resources);

  return results;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { folder } = req.query;

  const folders: Folder[] = await getFolders();
  const images: Image[] | null = folder ? await getImages(folder as string) : null;

  res.status(200).json({ folders, images });
}
