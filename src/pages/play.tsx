import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { DefaultBackgroundImage } from "../utils/default";
import { Send } from "lucide-react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

function Play() {
  const [answer, setAnswer] = useState<string | null>(null);

  const router = useRouter();
  const { data, error, isLoading } = useQuery("game", getGame, { refetchOnWindowFocus: false, retry: false });

  if (isLoading) return <Loader />;
  if (error) return <Error text={"Error: " + error} />;

  return (
    <>
      <Head>
        <title>Play • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-28 flex flex-col items-center gap-2 rounded-lg border p-8">
        <Image src={data?.question || DefaultBackgroundImage} className="h-auto max-h-[200px] max-w-[300px] md:object-contain md:max-w-none md:w-[500px]" width={1000} height={1000} alt={"question"} priority />
        <div className="flex gap-2">
          <div className={"flex h-[35px] items-center justify-start gap-2 rounded-lg px-4 border"}>
            <input onChange={(e) => setAnswer(e.currentTarget.value)} placeholder="Enter your answer" autoComplete="off" type="number" id={"Answer"} className={"h-full placeholder:text-gray-500 focus:outline-none"} />
          </div>
          <button disabled={answer === null || answer === ""} onClick={() => (Number(answer) === data?.solution ? toast("Answer Correct", { hideProgressBar: true, autoClose: 2000, type: "success" }) : toast("Answer Inorrect", { hideProgressBar: true, autoClose: 2000, type: "error" }))} className="px-4 grid place-items-center cursor-pointer rounded-2xl disabled:cursor-not-allowed bg-blue-500 disabled:bg-blue-300 disabled:text-gray-700 text-gray-100">
            <Send size={20} />
          </button>
        </div>
      </main>
    </>
  );
}

export default Play;

const getGame = async () => {
  const res = await fetch("https://marcconrad.com/uob/smile/api.php");
  return res.json() as unknown as { question: string; solution: number };
};
