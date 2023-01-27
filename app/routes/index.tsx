import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { FolderLink, Footer } from "~/components";

type Data = {
  Key: string;
};

export interface Folder {
  name: string;
  path: string;
  featured?: string;
  count: number;
}

export const loader = async () => {
  const s3Client = new S3Client({
    region: process.env.SITE_AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.SITE_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string
    }
  });

  // Create the parameters for the bucket
  const bucketParams = { Bucket: process.env.AWS_BUCKET as string };

  const { Contents } = await s3Client.send(new ListObjectsCommand(bucketParams));
  const data = Contents as [];

  const folders = data.reduce((arr: any[], item: any) => {
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
  }, []);

  return json({ folders });
};

export default function Index() {
  const { folders } = useLoaderData<typeof loader>();

  return (
    <div className="bg-slate-900 min-h-screen">
      <main
        className="p-4 md:p-10 lg:p-20 flex justify-between flex-col min-h-screen"
        style={{ minHeight: "calc(100vh - 50px)" }}
      >
        <div className="flex flex-col gap-2 pb-16">
          {folders ? (
            folders?.map(({ name, featured, count }: Folder, idx: number) => (
              <FolderLink key={idx} name={name} featured={featured} count={count} />
            ))
          ) : (
            <p>No folders found</p>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
