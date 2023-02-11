import Head from "next/head";

export default function Error({ ...props }: { text: string }) {
  return (
    <>
      <Head>
        <title>{props.text}</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-w-screen min-h-screen flex-col items-center justify-center">
        <p>{props.text}</p>
      </main>
    </>
  );
}
