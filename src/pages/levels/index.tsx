import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../../components/Error";
import Loader from "../../components/Loader";
import { api } from "../../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Levels() {
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [levels, user] = api.useQueries((t) => [t.levelRouter.getAllLevels(undefined, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" }), t.userRouter.getUser({ id: session?.user.id || "" }, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" })]);

  const indexing = 10;
  const pages = Math.ceil((levels.data?.length || 0) / indexing);

  if (levels.isLoading || user.isLoading) return <Loader />;
  if (levels.isError || !levels.data || user.isError || !user.data) return <Error text="Data not found" />;

  return (
    <>
      <Head>
        <title>Levels • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center mt-20 mb-36">
        <div className="shadow-md">
          <table className="sm:w-[320px] w-screen md:w-[700px] text-left text-gray-500 text-xs md:text-sm">
            <thead className="text-gray-700 uppercase bg-gray-50 text-center">
              <tr>
                <th scope="col" className="py-1 md:py-3 px-3">
                  #
                </th>
                <th scope="col" className="py-1 md:py-3">
                  ID
                </th>
                <th scope="col" className="py-1 md:py-3">
                  Wins
                </th>
                <th scope="col" className="py-1 md:py-3">
                  Losses
                </th>
                <th scope="col" className="py-1 md:py-3">
                  Win Ratio
                </th>
                <th scope="col" className="py-1 md:py-3">
                  Your Record
                </th>
                <th scope="col" className="py-1 md:py-3">
                  Play
                </th>
              </tr>
            </thead>
            <tbody>
              {levels.data?.slice((page - 1) * indexing, (page - 1) * indexing + indexing).map((level, index) => {
                const wins = level.rounds.filter((e) => e.success);
                const losses = level.rounds.filter((e) => !e.success);
                const userRecord = user.data?.rounds.find((l) => l.levelId === level.id);

                return (
                  <tr key={(page - 1) * indexing + index + 1} className="bg-white border-b">
                    <td className="text-center py-1 md:pt-3">{(page - 1) * indexing + index + 1}</td>
                    <td className="text-center py-1 md:pt-3">
                      <p className="truncate w-8 md:w-auto">{level.id}</p>
                    </td>
                    <td className="text-center py-1 md:pt-3">{wins.length}</td>
                    <td className="text-center py-1 md:pt-3">{losses.length}</td>
                    <td className="text-center py-1 md:pt-3 md:flex md:justify-center">
                      <WinRateBar wins={wins.length} losses={losses.length} classList={"md:mt-2"} />
                    </td>
                    <td className="text-center py-1 md:pt-3 truncate">{userRecord ? <p>{(userRecord.timeTaken || 0) / 1000}s</p> : <p>NAY</p>}</td>
                    <td className="text-center py-1 md:pt-3 truncate">
                      {
                        <button disabled={Boolean(userRecord)} onClick={() => router.push("/levels/" + level.id)} className="p-2 rounded-lg bg-black text-white disabled:bg-zinc-400">
                          Play
                        </button>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="m-8 flex w-40 justify-center">
          <div className="flex">
            {page === 1 ? <p className="w-6"></p> : <ChevronLeft onClick={() => setPage(page - 1)} />}
            {[...Array(pages)].map((e, i) => (
              <button className="mx-2" key={i} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            {page === pages ? <p className="w-6"></p> : <ChevronRight onClick={() => setPage(page + 1)} />}
          </div>
        </div>
      </main>
    </>
  );
}

export default Levels;

const WinRateBar = ({ ...props }: { wins: number; losses: number; classList?: string }) => {
  const winRate = Math.round((props.wins / (props.wins + props.losses)) * 100);

  return (
    <div className={props.classList + " text-[8px]"}>
      <div className={"text-gray-500 text-center absolute z-20 rounded-sm h-4 w-[100px] flex justify-evenly items-center mt-[2px]"}>
        <p className="truncate">{props.wins}W</p>
        <p className="truncate">{Number.isNaN(winRate) ? "0" : winRate}%</p>
        <p className="truncate">{props.losses}L</p>
      </div>
      <div className={"absolute z-10 rounded-sm bg-blue-300 h-4"} style={{ width: winRate }}></div>
      <div className={"rounded-sm h-4 w-[100px] bg-red-300 grid grid-flow-col place-content-stretch"} />
    </div>
  );
};
