import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

function Level() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Level {router.query.level} • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  );
}

export default Level;
