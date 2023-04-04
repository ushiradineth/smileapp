import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/AlertboxMenu";
import { api } from "../utils/api";
import { DefaultBackgroundImage } from "../utils/default";
import { HeartCrack, HeartIcon, Send } from "lucide-react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

function Play() {
  const { data: session } = useSession();
  const [answer, setAnswer] = useState<string | null>(null);
  const [timer, setTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [winStreak, setWinStreak] = useState(0);
  const endBtn = useRef<HTMLButtonElement>(null);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showWin, setShowWin] = useState(false);
  const [showLose, setShowLose] = useState(false);
  const setRound = api.roundRouter.setRound.useMutation({});
  const { data, error, isLoading, refetch } = useQuery("game", getGame, { refetchOnWindowFocus: false, retry: false });

  const onWin = () => {
    (document.getElementById("Answer") as HTMLInputElement).value = "";
    setWinStreak(winStreak + 1);
    setRound.mutate({ userid: session?.user.id || "", question: data?.question || "", solution: data?.solution || 0, time, success: true }, { onError: () => toast("Failed to set data", { hideProgressBar: true, autoClose: 2000, type: "error" }) });
    setTimer(false);
    setTime(0);
    refetch();
    setShowWin(true);
  };

  const onLose = () => {
    setRound.mutate({ userid: session?.user.id || "", question: data?.question || "", solution: data?.solution || 0, time, success: false }, { onError: () => toast("Failed to set data", { hideProgressBar: true, autoClose: 2000, type: "error" }) });
    if (hearts === 1) {
      setHearts(hearts - 1);
      endBtn.current?.click();
    } else if (hearts > 0) {
      setShowLose(true);
      setHearts(hearts - 1);
    }
  };

  useEffect(() => {
    if (showWin || showLose || showCountdown) setTimer(false);
  }, [showWin, showLose, showCountdown]);

  if (isLoading) return <Loader />;
  if (error) return <Error text={"Error: " + error} />;

  return (
    <>
      <Head>
        <title>Play • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-28 mb-60 flex flex-col items-center gap-2 rounded-lg border px-1 py-8 md:h-[400px] md:w-[500px]">
        <Stopwatch timer={timer} setTimer={setTimer} time={time} setTime={setTime} />
        <div className="grid grid-flow-col place-items-center gap-8 md:gap-16">
          <Hearts hearts={hearts} />
          <p>Score: {winStreak}</p>
          <EndMenu btnref={endBtn} winStreak={winStreak} hearts={hearts} setTimer={setTimer} />
        </div>
        {showCountdown ? (
          <Image
            src={"/Countdown.gif"}
            onLoad={() => {
              showCountdown &&
                setTimeout(() => {
                  setShowCountdown(false);
                  setTimer(true);
                }, 3000);
            }}
            unoptimized
            className="h-auto max-h-[200px] max-w-[300px] md:w-[500px] md:max-w-none md:object-contain"
            width={1000}
            height={1000}
            alt={"Win"}
            priority
          />
        ) : showWin ? (
          <Image src={"/Win.gif"} onLoad={() => showWin && setTimeout(() => setShowWin(false), 1000)} unoptimized className="h-auto max-h-[200px] max-w-[300px] md:w-[500px] md:max-w-none md:object-contain" width={1000} height={1000} alt={"Win"} priority />
        ) : showLose ? (
          <Image src={"/Lose.gif"} onLoad={() => showLose && setTimeout(() => setShowLose(false), 1000)} unoptimized className="h-auto max-h-[200px] max-w-[300px] md:w-[500px] md:max-w-none md:object-contain" width={1000} height={1000} alt={"Win"} priority />
        ) : (
          <Image src={data?.question || DefaultBackgroundImage} className="h-auto max-h-[200px] max-w-[300px] md:w-[500px] md:max-w-none md:object-contain" width={1000} height={1000} alt={"question"} priority />
        )}
        <div className="flex gap-2">
          <div className={"flex h-[35px] items-center justify-start gap-2 rounded-lg border px-4"}>
            <input onChange={(e) => setAnswer(e.currentTarget.value)} placeholder="Enter your answer" autoComplete="off" type="number" id={"Answer"} className={"h-full placeholder:text-gray-500 focus:outline-none"} />
          </div>
          <button disabled={answer === null || answer === "" || showWin || showLose || showCountdown} onClick={() => (Number(answer) === data?.solution ? onWin() : onLose())} className="grid cursor-pointer place-items-center rounded-2xl bg-blue-500 px-4 text-gray-100 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:text-gray-700">
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
    <div className="flex w-[60px] items-center">
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
      <AlertDialogTrigger ref={props.btnref} className="rounded-lg border-2 px-4 pt-2 pb-1" onClick={() => props.setTimer(false)}>
        END
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Well done!</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col">
              <span>Wins: {props.winStreak}</span>
              <span>Hearts Lost: {3 - props.hearts}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>Home</AlertDialogAction>
          <AlertDialogAction onClick={() => location.reload()}>Restart</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
