import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useParams } from "react-router-dom";

import { Footer, ModalImage } from "~/components";

export const loader: LoaderFunction = async ({ params }) => {
  const s3Client = new S3Client({
    region: process.env.SITE_AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.SITE_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string
    }
  });

  // Create the parameters for the bucket
  const bucketParams = {
    Bucket: `${process.env.AWS_BUCKET}` as string,
    Prefix: ("_" + params.name) as string
  };
  const { Contents } = await s3Client.send(new ListObjectsCommand(bucketParams));
  const data = Contents as [];

  const pictures = data
    .filter(({ Key }: { Key: string }) => Key.split("/")[0] === `_${params.name}`)
    .reduce((arr: any[], item: any) => {
      const { Key } = item;
      const src = `${process.env.AWS_BUCKET_URL + Key}`;

      arr.push({
        src
      });

      return arr;
    }, []);

  return json({ pictures });
};

export default function Index() {
  let params = useParams();
  const { pictures } = useLoaderData<typeof loader>();

  return (
    <div className="bg-slate-900 min-h-screen">
      <main className="p-4 md:p-10 lg:p-20 min-h-screen bg-gray-900">
        <div className="mb-2 md:mb-5 lg:mb-10">
          <h1 className="capitalize text-2xl md:text-4xl lg:text-7xl font-bold text-white">
            {params.name?.toString().replaceAll("-", " ")}
          </h1>
          <Link className="font-semibold text-slate-500" to={`/`}>
            Back
          </Link>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }} className="mb-20">
          <Masonry gutter="2vw">
            {pictures?.map(({ src }: { src: string }) => (
              <ModalImage key={`gallery-${src}`} src={src} />
            ))}
          </Masonry>
        </ResponsiveMasonry>

        <Footer />
      </main>
    </div>
  );
}
