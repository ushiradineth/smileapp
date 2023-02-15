import Head from "next/head";

export default function Loader() {
  return (
    <>
      <Head>
        <title>Loading...</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-w-screen min-h-screen font-cal flex-col items-center justify-center mb-40">
        <p className="h-8 w-16 animate-spin fill-pink-200 text-black dark:text-gray-600 absolute">{"["}</p>
        <p>SMILE</p>
      </main>
    </>
  );
}
