// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Folder, Image } from "@/models/types";
import cloudinary from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

/**
 * Get all folders in the specified folder
 * @returns array of Folder objects
 */
export const getFolders = async (folder: string) => {
  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD}/folders/${folder}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_KEY + ":" + process.env.CLOUDINARY_SECRET).toString(
        "base64"
      )}`
    }
  });

  const json = await response.json();

  const foldersPromise = await Promise.allSettled(
    json.folders.map(async (f: Folder) => {
      const featured = await getImages("iaremarkuspics", f.name, 1);

      return { featured: featured[0].url, ...f };
    })
  );

  const folders = foldersPromise.map((f: any) => f.value);

  return folders as Folder[];
};

/**
 * This function is used to get all the images from the specified child folder of the parent folder
 *
 * @param parentFolder Likely the same as `folder` in `getFolders` function
 * @param folder The name of the child folder to get images from. This is used in `[name].tsx`
 * @param count How many images to return
 * @param tag Cloudinary tag to filter images by - defaults to 'featured'
 * @returns array of Image objects
 */
export const getImages = async (
  parentFolder: string,
  folder: string,
  count: number = 300,
  tag: string = "featured"
) => {
  const cl = cloudinary.v2;

  cl.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  const results = await cl.search
    .expression(`folder:${parentFolder}/${folder} tag:${tag}`)
    .max_results(count || 500)
    .execute()
    .then(result => result.resources);

  return results;
};

/**
 * API route to get all folders and images
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { folder } = req.query;

  const folders: Folder[] = await getFolders("iaremarkuspics");
  const images: Image[] | null = folder ? await getImages("iaremarkuspics", folder as string) : null;

  res.status(200).json({ folders, images });
}
