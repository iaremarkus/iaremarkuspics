import { ModalImage } from "@/ModalImage";
import { Folder, Image as I } from "@/models/types";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Gallery from "react-photo-gallery";

type Data = {
  folders: Folder[];
  images: I[];
};

export default function Home({ images }: Data) {
  const {
    query: { name }
  } = useRouter();

  const pics = images.map(({ url, width, height }) => {
    return { src: url, width, height };
  });

  return (
    <>
      <Head>
        <title>{name} | Pictures by iaremarkus | cc IG: iaremarkuspics</title>
        <meta name="description" content="Pictures by iaremarkus | cc IG: iaremarkuspics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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

        <Gallery
          photos={pics}
          columns={2}
          margin={10}
          renderImage={({ photo: { src, height, width } }) => (
            <ModalImage key={`gallery-${src}`} width={width} height={height} src={src} />
          )}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { name } = params || {};

  // Fetch data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images?folder=${name}`);
  const { folders, images }: Data = await res.json();

  // Pass folders to the page via props
  return { props: { folders, images } };
};
