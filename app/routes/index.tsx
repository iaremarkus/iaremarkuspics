import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import type { HeadersFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
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

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24 * 30}`
  };
};

export let meta: MetaFunction = () => {
  return {
    title: `Photos by iaremarkus | cc IG: iaremarkuspics`,
    description: `Photography by iaremarkus. All photos are licensed under CC BY-NC-ND 4.0.`,
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1"
  };
};

export function links() {
  return [
    {
      rel: "shortcut icon",
      href: "data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd'%3E%3Cstyle%3E path%7B stroke: %23000000; %7D @media (prefers-color-scheme: dark) %7B path%7B stroke: %23ffffff; %7D %7D %3C/style%3E%3Cpath d='M4.348 21.241l4.185-7.249 5.67 9.806c-.714.133-1.45.202-2.203.202-2.907 0-5.575-1.036-7.652-2.759zm18.97-5.247c-1.182 3.345-3.806 6.012-7.124 7.252l-4.187-7.252h11.311zm-14.786-6l-5.656 9.797c-1.793-2.097-2.876-4.819-2.876-7.791 0-.684.057-1.354.167-2.006h8.365zm12.583-5.795c1.798 2.098 2.885 4.824 2.885 7.801 0 .679-.057 1.345-.165 1.994h-8.373l5.653-9.795zm-11.305-3.999c.71-.131 1.442-.2 2.19-.2 2.903 0 5.566 1.033 7.642 2.751l-4.18 7.24-5.652-9.791zm2.19 7.794h-11.314c1.186-3.344 3.812-6.008 7.132-7.244l4.182 7.244z'/%3E%3C/svg%3E",
      type: "image/svg+xml"
    }
  ];
}

export const loader: LoaderFunction = async () => {
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

  return json({ folders, gaTrackingId: process.env.GOOGLE_ANALYTICS });
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
