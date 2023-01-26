import { ModalImage } from "@/ModalImage";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import path from "path";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function Home({ pictures }: any) {
  const {
    query: { name }
  } = useRouter();

  return (
    <>
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
        <title>Photos of {name} | Photos by iaremarkus | cc IG: iaremarkuspics</title>
        <meta name="description" content="Photos by iaremarkus | cc IG: iaremarkuspics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="shortcut icon"
          href="data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd'%3E%3Cstyle%3E path%7B stroke: %23000000; %7D @media (prefers-color-scheme: dark) %7B path%7B stroke: %23ffffff; %7D %7D %3C/style%3E%3Cpath d='M4.348 21.241l4.185-7.249 5.67 9.806c-.714.133-1.45.202-2.203.202-2.907 0-5.575-1.036-7.652-2.759zm18.97-5.247c-1.182 3.345-3.806 6.012-7.124 7.252l-4.187-7.252h11.311zm-14.786-6l-5.656 9.797c-1.793-2.097-2.876-4.819-2.876-7.791 0-.684.057-1.354.167-2.006h8.365zm12.583-5.795c1.798 2.098 2.885 4.824 2.885 7.801 0 .679-.057 1.345-.165 1.994h-8.373l5.653-9.795zm-11.305-3.999c.71-.131 1.442-.2 2.19-.2 2.903 0 5.566 1.033 7.642 2.751l-4.18 7.24-5.652-9.791zm2.19 7.794h-11.314c1.186-3.344 3.812-6.008 7.132-7.244l4.182 7.244z'/%3E%3C/svg%3E"
          type="image/svg+xml"
        />
      </Head>

      <main className="p-4 md:p-10 lg:p-20 min-h-screen bg-gray-900">
        <div className="mb-2 md:mb-5 lg:mb-10">
          <h1 className="capitalize text-2xl md:text-4xl lg:text-7xl font-bold text-white">
            {name?.toString().replaceAll("-", " ")}
          </h1>
          <Link className="font-semibold text-slate-500" href={`/`}>
            Back
          </Link>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="2vw">
            {pictures?.map(({ src }: { src: string }) => (
              <ModalImage key={`gallery-${src}`} src={src} />
            ))}
          </Masonry>
        </ResponsiveMasonry>

        <a
          href="https://instagram.com/iaremarkuspics"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 mt-20 text-2xl font-semibold text-slate-700 mb-2 md:mb-5 lg:mb-10 flex gap-2 items-center transition hover:text-white"
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
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string
    }
  });

  // Create the parameters for the bucket
  const bucketParams = { Bucket: process.env.AWS_BUCKET as string };
  let pictures: any[] = [];

  try {
    const { Contents } = await s3Client.send(new ListObjectsCommand(bucketParams));
    const data = Contents as [];

    pictures = data
      .filter(({ Key }: { Key: string }) => Key.split("/")[0] === `_${context.params?.name}`)
      .reduce((arr: any[], item: any) => {
        const { Key } = item;
        const key = Key.split("/")[1];
        const src = `${process.env.AWS_BUCKET_URL + Key}`;
        const { name } = path.parse(key);

        arr.push({
          src,
          name
        });

        return arr;
      }, []);
  } catch (err) {
    console.log("Error", err);
  }

  // Pass folders to the page via props
  return { props: { pictures } };
};
