import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "../utils/api";
import { env } from "../env.mjs";

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log(session);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Welcome to SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-2 py-2">
        <button className="flex w-full select-none items-center justify-center gap-2 rounded-full bg-white from-red-300 via-pink-300 to-orange-100 px-8 py-3 font-semibold text-black no-underline transition hover:bg-gradient-to-br" onClick={() => signIn("github")}>
          github
        </button>
      </main>
    </>
  );
};

export default Home;
