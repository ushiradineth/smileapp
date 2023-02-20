import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../../components/Error";
import Loader from "../../components/Loader";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/AlertboxMenu";
import { AlertDialogFooter, AlertDialogHeader } from "../../components/ui/AlertboxMenu";
import { api } from "../../utils/api";
import { DefaultBackgroundImage } from "../../utils/default";
import { Hearts, Stopwatch } from "../play";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

function Level() {
  const [timer, setTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [hearts, setHearts] = useState(3);
  const endBtn = useRef<HTMLButtonElement>(null);
  const setRound = api.roundRouter.setRound.useMutation({});
  const { data: session, status } = useSession();
  const router = useRouter();

  const [level, user] = api.useQueries((t) => [t.levelRouter.getLevel({ levelid: router.query.level as string }, { retry: false, refetchOnWindowFocus: false, enabled: typeof router.query.level !== "undefined" && status === "authenticated" }), t.userRouter.getUser({ id: session?.user.id || "" }, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" })]);

  const onWin = () => {
    (document.getElementById("Answer") as HTMLInputElement).value = "";
    toast("Answer Correct", { hideProgressBar: true, autoClose: 2000, type: "success" });
    endBtn.current?.click();
    setRound.mutate(
      { userid: session?.user.id || "", question: level.data?.link || "", solution: level.data?.solution || 0, time, success: true },
      {
        onSuccess: () => {
          setTimer(false);
          setTime(0);
        },
        onError: () => {
          toast("Failed to set data", { hideProgressBar: true, autoClose: 2000, type: "error" });
        },
      }
    );
  };

  const onLose = () => {
    toast("Answer Incorrect", { hideProgressBar: true, autoClose: 2000, type: "error" });
    setRound.mutate({ userid: session?.user.id || "", question: level.data?.link || "", solution: level.data?.solution || 0, time, success: false }, { onError: () => toast("Failed to set data", { hideProgressBar: true, autoClose: 2000, type: "error" }) });
    if (hearts === 1) {
      setHearts(hearts - 1);
      endBtn.current?.click();
    } else if (hearts > 0) setHearts(hearts - 1);
  };

  if (level.isLoading) return <Loader />;
  if (level.error) return <Error text={"Error: " + level.error} />;
  if (user.data?.rounds.find((l) => l.levelId === level.data?.id)) return <Error text={"You have already attempted this level"} />;

  return (
    <>
      <Head>
        <title>Level {router.query.level} • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-28 flex flex-col items-center gap-2 rounded-lg border px-1 py-8">
        <div className="grid place-items-center grid-flow-col gap-6">
          <Hearts hearts={hearts} />
          <Stopwatch timer={timer} setTimer={setTimer} time={time} setTime={setTime} />
          <EndMenu btnref={endBtn} hearts={hearts} time={time} setTimer={setTimer} />
        </div>
        <Image src={level.data?.link || DefaultBackgroundImage} onLoad={() => setTimer(true)} className="h-auto max-h-[200px] max-w-[300px] md:object-contain md:max-w-none md:w-[500px]" width={1000} height={1000} alt={"question"} priority />
        <div className="flex gap-2">
          <div className={"flex h-[35px] items-center justify-start gap-2 rounded-lg px-4 border"}>
            <input onChange={(e) => setAnswer(e.currentTarget.value)} placeholder="Enter your answer" autoComplete="off" type="number" id={"Answer"} className={"h-full placeholder:text-gray-500 focus:outline-none"} />
          </div>
          <button disabled={answer === null || answer === ""} onClick={() => (Number(answer) === level.data?.solution ? onWin() : onLose())} className="px-4 grid place-items-center cursor-pointer rounded-2xl disabled:cursor-not-allowed bg-blue-500 disabled:bg-blue-300 disabled:text-gray-700 text-gray-100">
            <Send size={20} />
          </button>
        </div>
      </main>
    </>
  );
}

export default Level;

function EndMenu({ ...props }: { hearts: number; time: number; setTimer: (arg0: boolean) => void; btnref: React.RefObject<HTMLButtonElement> }) {
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
              <span>Time taken: {props.time / 1000}</span>
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
