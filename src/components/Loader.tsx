import Head from "next/head";
import { useSession } from "next-auth/react";

export default function Loader() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Loading...</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-w-screen min-h-screen flex-col items-center justify-center">
        <p className="h-8 w-16 animate-spin fill-pink-200 text-black dark:text-gray-600 absolute">{"["}</p>
        <p>SMILE</p>
      </main>
    </>
  );
}
