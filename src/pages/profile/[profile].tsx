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
import { WinRateBar } from "../leaderboard";
import { LinkIcon } from "lucide-react";
import { type Round } from "@prisma/client";

const Profile: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const profile = api.userRouter.getUser.useQuery({ id: router.query.profile as string }, { retry: false, refetchOnWindowFocus: false, enabled: typeof router.query.profile !== "undefined" && status === "authenticated" });

  const rank = api.userRouter.getUserRank.useQuery({ id: router.query.profile as string }, { retry: false, refetchOnWindowFocus: false, enabled: typeof router.query.profile !== "undefined" && status === "authenticated" });

  if (profile.isLoading) return <Loader />;
  if (profile.isError || !profile.data) return <Error text="User not found" />;

  return (
    <>
      <Head>
        <title>{profile.data?.name} on SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-full flex mb-20">
          <div className="flex flex-col items-center border-2 h-fit my-10 p-8 rounded-sm gap-2">
            <Image src={profile.data?.image || DefaultUserImage} className={"rounded-full"} height={200} width={200} alt={"User Image"} />
            <div className="flex flex-col items-center">
              <p>{profile.data?.name}</p>
              <p>{profile.data?.email}</p>
            </div>
            <p>Rank #{rank.data}</p>
            <WinRateBar wins={profile.data?.wins || 0} losses={profile.data?.losses || 0} classList={"mb-2"} />
            <ExtraDetails rounds={profile.data?.rounds || []} />
          </div>
        </div>
      </main>
    </>
  );
};

function ExtraDetails({ ...props }: { rounds: Round[] }) {
  let weekGameTime = 0;
  let allGameTime = 0;

  props.rounds.forEach((e) => {
    if (e.finishedAt.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 7) weekGameTime = weekGameTime + (e.timeTaken || 0) / 1000;
    allGameTime = allGameTime + (e.timeTaken || 0) / 1000;
  });

  const processedValues = Object.values(props.rounds);
  const fastestTime = Math.min(...processedValues.map((obj) => obj.timeTaken || 0));

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center rounded-lg border p-2">
        <p>Game time</p>
        <p>Last Week: {Math.round(weekGameTime / 60)}m</p>
        <p>All time: {Math.round(allGameTime / 60)}m</p>
      </div>
      <div className={`flex flex-col h-fit items-center rounded-lg border p-2 ${fastestTime === Infinity && "hidden"}`}>
        <p>Fastest round</p>
        <p>Time: {fastestTime / 1000}s</p>
        <Link className="flex gap-2" href={`https://www.sanfoh.com/uob/smile/data/${props.rounds.find((e) => e.timeTaken == fastestTime)?.levelId}.png` || "/"}>
          Round <LinkIcon size={20} />
        </Link>
      </div>
    </div>
  );
}

export default Profile;
