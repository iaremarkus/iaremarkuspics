import { Folder, Image } from "@/models/types";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Script from "next/script";

import { FolderLink } from "..";

type Data = {
  folders: Folder[];
  images: Image[];
};

export default function Home({ folders }: Data) {
  return (
    <div className="bg-slate-900 min-h-screen">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-M7CFEQJ0J9" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-M7CFEQJ0J9');
        `}
      </Script>

      <Head>
        <title>Pictures by iaremarkus | cc IG: iaremarkuspics</title>
        <meta name="description" content="Pictures by iaremarkus | cc IG: iaremarkuspics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="p-4 md:p-10 lg:p-20 flex justify-between flex-col min-h-screen"
        style={{ minHeight: "calc(100vh - 50px)" }}
      >
        <div className="flex flex-col gap-2 pb-16">
          {folders?.map(({ name, featured }: Folder, idx: number) => (
            <FolderLink key={idx} name={name} featured={featured} />
          ))}
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
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images`);
  const { folders, images }: Data = await res.json();

  // Pass folders to the page via props
  return { props: { folders, images } };
};
