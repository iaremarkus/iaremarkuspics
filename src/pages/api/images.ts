// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  Key: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
  const {
    query: { bucket, folder }
  } = req;

  const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string
    }
  });

  // Create the parameters for the bucket
  const bucketParams = { Bucket: bucket as string };

  try {
    const { Contents } = await s3Client.send(new ListObjectsCommand(bucketParams));
    const data = Contents as [];

    res.statusCode = 200;

    if (folder) {
      res.json(data.filter(({ Key }: { Key: string }) => Key.split("/")[0] === `_${folder}`));
    } else {
      res.json(
        data.reduce((arr: any[], item: any) => {
          const key = item.Key as string;
          const folderName = key.split("/")[0].replaceAll("_", "");
          const thisFolder = data.filter((i: Data) => i.Key.includes(key.split("/")[0]));
          const randomObject: Data = thisFolder[Math.floor(Math.random() * thisFolder.length)];
          const featured = process.env.AWS_BUCKET_URL + randomObject.Key;

          if (arr.filter(i => i.name === folderName).length === 0) {
            arr.push({
              name: folderName,
              featured,
              count: thisFolder.length
            });
          }

          return arr;
        }, [])
      );
    }
  } catch (err) {
    console.log("Error", err);
    res.statusCode = 500;
    res.json(err as []);
  }
}
