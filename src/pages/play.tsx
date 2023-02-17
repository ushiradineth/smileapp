import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { DefaultBackgroundImage } from "../utils/default";
import { HeartCrack, HeartIcon, HeartPulse, Send } from "lucide-react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

function Play() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [timer, setTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [hearts, setHearts] = useState(3);

  const { data, error, isLoading, refetch } = useQuery("game", getGame, { refetchOnWindowFocus: false, retry: false, onSettled: () => setTimer(true) });

  const onWin = () => {
    (document.getElementById("Answer") as HTMLInputElement).value = "";
    toast("Answer Correct", { hideProgressBar: true, autoClose: 2000, type: "success" });
    console.log(time);
    setTimer(false);
    setTime(0);
    refetch();
    setTimer(true);
  };

  const onLose = () => {
    toast("Answer Incorrect", { hideProgressBar: true, autoClose: 2000, type: "error" });
    if (hearts === 1) {
      setHearts(hearts - 1);
      console.log("LOSE");
    } else if (hearts > 0) setHearts(hearts - 1);

    console.log(time);
  };

  useEffect(() => {
    console.log(data?.solution);
  }, [data?.solution]);

  if (isLoading) return <Loader />;
  if (error) return <Error text={"Error: " + error} />;

  return (
    <>
      <Head>
        <title>Play • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-28 flex flex-col items-center gap-2 rounded-lg border p-4 md:p-8">
        <Hearts hearts={hearts} />
        <Stopwatch timer={timer} setTimer={setTimer} time={time} setTime={setTime} />
        <Image src={data?.question || DefaultBackgroundImage} className="h-auto max-h-[200px] max-w-[300px] md:object-contain md:max-w-none md:w-[500px]" width={1000} height={1000} alt={"question"} priority />
        <div className="flex gap-2">
          <div className={"flex h-[35px] items-center justify-start gap-2 rounded-lg px-4 border"}>
            <input onChange={(e) => setAnswer(e.currentTarget.value)} placeholder="Enter your answer" autoComplete="off" type="number" id={"Answer"} className={"h-full placeholder:text-gray-500 focus:outline-none"} />
          </div>
          <button disabled={answer === null || answer === ""} onClick={() => (Number(answer) === data?.solution ? onWin() : onLose())} className="px-4 grid place-items-center cursor-pointer rounded-2xl disabled:cursor-not-allowed bg-blue-500 disabled:bg-blue-300 disabled:text-gray-700 text-gray-100">
            <Send size={20} />
          </button>
        </div>
      </main>
    </>
  );
}

export default Play;

async function getGame() {
  const res = await fetch("https://marcconrad.com/uob/smile/api.php");
  return res.json() as unknown as { question: string; solution: number };
}

function Hearts({ ...props }: { hearts: number }) {
  return (
    <div className="flex">
      {[...Array(props.hearts)].map((e, i) => (
        <span key={i}>
          <HeartIcon fill="red" />
        </span>
      ))}
      {[...Array(3-props.hearts)].map((e, i) => (
        <span key={i}>
          <HeartCrack />
        </span>
      ))}
    </div>
  );
}

function Stopwatch({ ...props }: { timer: boolean; setTimer: (arg0: boolean) => void; time: number; setTime: any }) {
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (props.timer) {
      interval = setInterval(() => {
        props.setTime((prevTime: number) => prevTime + 10);
      }, 10);
    } else if (!props.timer) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.timer]);

  return (
    <div className="stopwatch">
      <div className="numbers">
        <span>{("0" + Math.floor((props.time / 60000) % 60)).slice(-2)}:</span>
        <span>{("0" + Math.floor((props.time / 1000) % 60)).slice(-2)}:</span>
        <span>{("0" + ((props.time / 10) % 100)).slice(-2)}</span>
      </div>
    </div>
  );
}
