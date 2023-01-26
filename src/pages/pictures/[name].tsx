import { Footer, ModalImage } from "@/index";
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
        <title>
          Photos of {name?.toString().replaceAll("-", " ") as string} | Photos by iaremarkus | cc IG: iaremarkuspics
        </title>
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

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }} className="mb-20">
          <Masonry gutter="2vw">
            {pictures?.map(({ src }: { src: string }) => (
              <ModalImage key={`gallery-${src}`} src={src} />
            ))}
          </Masonry>
        </ResponsiveMasonry>

        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
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
    Prefix: ("_" + context.params?.name) as string
  };

  let pictures: any[] = [];

  try {
    const { Contents } = await s3Client.send(new ListObjectsCommand(bucketParams));
    const data = Contents as [];

    pictures = data
      .filter(({ Key }: { Key: string }) => Key.split("/")[0] === `_${context.params?.name}`)
      .reduce((arr: any[], item: any) => {
        const { Key } = item;
        const src = `${process.env.AWS_BUCKET_URL + Key}`;

        arr.push({
          src
        });

        return arr;
      }, []);
  } catch (err) {
    console.log("Error", err);
  }

  // Pass folders to the page via props
  return { props: { pictures } };
};
