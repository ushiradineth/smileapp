import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/AlertboxMenu";
import { DefaultBackgroundImage } from "../utils/default";
import { HeartCrack, HeartIcon, Send } from "lucide-react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

function Guest() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [timer, setTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [winStreak, setWinStreak] = useState(0);
  const endBtn = useRef<HTMLButtonElement>(null);

  const { data, error, isLoading, refetch } = useQuery("game", getGame, { refetchOnWindowFocus: false, retry: false });

  const onWin = () => {
    (document.getElementById("Answer") as HTMLInputElement).value = "";
    toast("Answer Correct", { hideProgressBar: true, autoClose: 2000, type: "success" });
    setWinStreak(winStreak + 1);
    setTimer(false);
    setTime(0);
    refetch();
    setTimer(true);
  };

  const onLose = () => {
    toast("Answer Incorrect", { hideProgressBar: true, autoClose: 2000, type: "error" });
    if (hearts === 1) {
      setHearts(hearts - 1);
      endBtn.current?.click();
    } else if (hearts > 0) setHearts(hearts - 1);
  };

  if (isLoading) return <Loader />;
  if (error) return <Error text={"Error: " + error} />;

  return (
    <>
      <Head>
        <title>Guest Play • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-28 flex flex-col items-center gap-2 rounded-lg border px-1 py-8">
        <div className="grid place-items-center grid-flow-col gap-6">
          <Hearts hearts={hearts} />
          <Stopwatch timer={timer} setTimer={setTimer} time={time} setTime={setTime} />
          <EndMenu btnref={endBtn} winStreak={winStreak} hearts={hearts} setTimer={setTimer} />
        </div>
        <Image src={data?.question || DefaultBackgroundImage} onLoad={() => setTimer(true)} className="h-auto max-h-[200px] max-w-[300px] md:object-contain md:max-w-none md:w-[500px]" width={1000} height={1000} alt={"question"} priority />
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

export default Guest;

async function getGame() {
  const res = await fetch("https://marcconrad.com/uob/smile/api.php");
  return res.json() as unknown as { question: string; solution: number };
}

export function Hearts({ ...props }: { hearts: number }) {
  return (
    <div className="flex">
      {[...Array(props.hearts)].map((e, i) => (
        <span key={i}>
          <HeartIcon fill="red" />
        </span>
      ))}
      {[...Array(3 - props.hearts)].map((e, i) => (
        <span key={i}>
          <HeartCrack />
        </span>
      ))}
    </div>
  );
}

export function Stopwatch({ ...props }: { timer: boolean; setTimer: (arg0: boolean) => void; time: number; setTime: any }) {
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
    <div className="flex items-center w-[60px]">
      <span>{("0" + Math.floor((props.time / 60000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((props.time / 1000) % 60)).slice(-2)}:</span>
      <span>{("0" + ((props.time / 10) % 100)).slice(-2)}</span>
    </div>
  );
}

function EndMenu({ ...props }: { winStreak: number; hearts: number; setTimer: (arg0: boolean) => void; btnref: React.RefObject<HTMLButtonElement> }) {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger ref={props.btnref} className="border-2 rounded-lg px-4 py-2" onClick={() => props.setTimer(false)}>
        END
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Well done!</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col">
              <span className="mb-2">
                Register to save data! <button onClick={() => signIn()}></button>
              </span>
              <span>Wins: {props.winStreak}</span>
              <span>Hearts Lost: {3 - props.hearts}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>Home</AlertDialogAction>
          <AlertDialogAction onClick={() => signIn()}>Register</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}