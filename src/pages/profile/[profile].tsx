import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../../components/Error";
import Loader from "../../components/Loader";
import { api } from "../../utils/api";
import { DefaultUserImage } from "../../utils/default";
import { type Round } from "@prisma/client";

const Profile: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const profile = api.userRouter.getUser.useQuery({ id: router.query.profile as string }, { retry: false, refetchOnWindowFocus: false, enabled: typeof router.query.profile !== "undefined" && status === "authenticated" });

  if (profile.isLoading) return <Loader />;
  if (profile.isError) return <Error text="User not found" />;

  return (
    <>
      <Head>
        <title>{profile.data?.name} on SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-full flex mb-20">
          <div className="flex flex-col items-center border-2 h-fit my-10 p-8 rounded-sm">
            <Image src={profile.data?.image || DefaultUserImage} className={"rounded-full"} height={200} width={200} alt={"User Image"} />
            <div className="flex flex-col items-center py-2">
              <p>{profile.data?.name}</p>
              <p>{profile.data?.email}</p>
            </div>
            <p className="py-2">Rank #10 (top 0.01%)</p>
            <Stats rounds={profile.data?.rounds || []} />
            <ExtraDetails rounds={profile.data?.rounds || []} />
          </div>
        </div>
      </main>
    </>
  );
};

function Stats({ ...props }: { rounds: Round[] }) {
  const winRate = Math.round((props.rounds.map(e => e.success).length || 0 / (props.rounds.map(e => e.success).length || 0 + props.rounds.map(e => !e.success).length || 0)) * 100);

  return (
    <>
      <div className="mb-2">
        <div className={`absolute rounded-sm h-4 w-[${winRate}px] bg-blue-300`}></div>
        <div className={"rounded-sm h-4 w-[100px] bg-red-300"}></div>
      </div>
      <div className="flex gap-2">
        <p>{props.rounds.length} Rounds</p>
        <p>{props.rounds.map(e => e.success).length} Wins</p>
        <p>{props.rounds.map(e => !e.success).length} Losses</p>
      </div>
      <p>{Number.isNaN(winRate) ? "0%" : winRate} Win Rate</p>
    </>
  );
}

function ExtraDetails({ ...props }: { rounds: Round[] }) {
  let weekGameTime = 0;
  let allGameTime = 0;

  props.rounds.forEach((e) => {
    if (e.finishedAt.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 7) weekGameTime = weekGameTime + e.finishedAt.getMinutes();
    allGameTime = allGameTime + e.finishedAt.getMinutes();
  });

  const processedValues = Object.values(props.rounds);
  const fastestTime = Math.min(...processedValues.map((obj) => obj.timeTaken || 0));

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center rounded-lg border p-2">
        <p>Game time</p>
        <p>Last Week: {weekGameTime}</p>
        <p>All time: {allGameTime}</p>
      </div>
      <div className={`flex flex-col h-fit items-center rounded-lg border p-2 ${fastestTime === Infinity && "hidden"}`}>
        <p>Fastest round</p>
        <Link href={props.rounds.find((e) => e.timeTaken == fastestTime)?.solutionLink || "/"}>
          <p>Time: {fastestTime}</p>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
