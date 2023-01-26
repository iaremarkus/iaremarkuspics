import { Folder } from "@/models/types";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Script from "next/script";

import { FolderLink } from "..";

type Data = {
  Key: string;
};

export default function Home({ folders }: any) {
  return (
    <div className="bg-slate-900 min-h-screen">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '${process.env.GOOGLE_ANALYTICS}');
        `}
      </Script>

      <Head>
        <title>Photos by iaremarkus | cc IG: iaremarkuspics</title>
        <meta name="description" content="Photos by iaremarkus | cc IG: iaremarkuspics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="shortcut icon"
          href="data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd'%3E%3Cstyle%3E path%7B stroke: %23000000; %7D @media (prefers-color-scheme: dark) %7B path%7B stroke: %23ffffff; %7D %7D %3C/style%3E%3Cpath d='M4.348 21.241l4.185-7.249 5.67 9.806c-.714.133-1.45.202-2.203.202-2.907 0-5.575-1.036-7.652-2.759zm18.97-5.247c-1.182 3.345-3.806 6.012-7.124 7.252l-4.187-7.252h11.311zm-14.786-6l-5.656 9.797c-1.793-2.097-2.876-4.819-2.876-7.791 0-.684.057-1.354.167-2.006h8.365zm12.583-5.795c1.798 2.098 2.885 4.824 2.885 7.801 0 .679-.057 1.345-.165 1.994h-8.373l5.653-9.795zm-11.305-3.999c.71-.131 1.442-.2 2.19-.2 2.903 0 5.566 1.033 7.642 2.751l-4.18 7.24-5.652-9.791zm2.19 7.794h-11.314c1.186-3.344 3.812-6.008 7.132-7.244l4.182 7.244z'/%3E%3C/svg%3E"
          type="image/svg+xml"
        />
      </Head>
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

        <a
          href="https://instagram.com/iaremarkuspics"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-semibold text-slate-700 mb-2 md:mb-5 lg:mb-10 flex gap-2 items-center transition hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="rgb(51 65 85 / var(--tw-text-opacity))"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          iaremarkuspics
        </a>
        <a rel="me" href="https://mastodon.africa/@iaremarkus">
          <svg xmlns="http://www.w3.org/2000/svg" width="230.842" height="247.477" viewBox="0 0 216.414 232.01">
            <path
              fill="#2b90d9"
              d="M211.807 139.088c-3.18 16.366-28.492 34.277-57.562 37.748-15.159 1.809-30.084 3.471-45.999 2.741-26.027-1.192-46.565-6.212-46.565-6.212 0 2.534.156 4.946.469 7.202 3.384 25.687 25.47 27.225 46.391 27.943 21.116.723 39.919-5.206 39.919-5.206l.867 19.09s-14.77 7.931-41.08 9.39c-14.51.797-32.525-.365-53.507-5.919C9.232 213.82 1.406 165.311.209 116.091c-.365-14.613-.14-28.393-.14-39.918 0-50.33 32.976-65.083 32.976-65.083C49.672 3.454 78.204.242 107.865 0h.729c29.66.242 58.21 3.454 74.837 11.09 0 0 32.975 14.752 32.975 65.082 0 0 .414 37.134-4.599 62.916"
            />
            <path
              fill="#fff"
              d="M177.51 80.077v60.941h-24.144v-59.15c0-12.469-5.246-18.797-15.74-18.797-11.602 0-17.417 7.507-17.417 22.352V117.8H96.207V85.423c0-14.845-5.816-22.352-17.418-22.352-10.494 0-15.74 6.328-15.74 18.797v59.15H38.905V80.077c0-12.455 3.171-22.352 9.541-29.675 6.569-7.322 15.171-11.076 25.85-11.076 12.355 0 21.711 4.748 27.898 14.247l6.013 10.082 6.015-10.082c6.185-9.498 15.542-14.247 27.898-14.247 10.677 0 19.28 3.753 25.85 11.076 6.369 7.322 9.54 17.22 9.54 29.675"
            />
          </svg>
          Mastodon
        </a>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string
    }
  });

  // Create the parameters for the bucket
  const bucketParams = { Bucket: process.env.AWS_BUCKET as string };
  let folders = [];

  try {
    const { Contents } = await s3Client.send(new ListObjectsCommand(bucketParams));
    const data = Contents as [];

    folders = data.reduce((arr: any[], item: any) => {
      const key = item.Key as string;
      const folderName = key.split("/")[0].replaceAll("_", "");
      const thisFolder = data.filter((i: Data) => i.Key.includes(key.split("/")[0]));
      const randomObjectFromThisFolder: Data = thisFolder[Math.floor(Math.random() * thisFolder.length)];
      const featured = process.env.AWS_BUCKET_URL + randomObjectFromThisFolder.Key;

      if (arr.filter(i => i.name === folderName).length === 0) {
        arr.push({
          name: folderName,
          featured,
          count: thisFolder.length
        });
      }

      return arr;
    }, []);
  } catch (err) {
    console.log("Error", err);
  }

  // Pass folders to the page via props
  return { props: { folders } };
};
