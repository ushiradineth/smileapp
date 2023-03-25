import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { api } from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function Leaderboard() {
  const [pageNum, setPageNum] = useState(1);
  const router = useRouter();
  const { status } = useSession();

  const users = api.userRouter.getLeaderboard.useQuery({ page: Number(router.query.page) || 1 }, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" });

  const indexing = 10;
  const noOfPages = Math.ceil((users.data?.length || 0) / indexing);

  if (users.isLoading) return <Loader />;
  if (users.isError || !users.data) return <Error text="Leaderboard failed to load" />;

  return (
    <>
      <Head>
        <title>Leaderboard • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-20 mb-36 flex flex-col items-center">
        <div className="shadow-md">
          <table className="w-screen text-left text-sm text-gray-500 sm:w-[320px] md:w-[700px]">
            <thead className="bg-gray-50 text-center text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="py-3 px-3">
                  #
                </th>
                <th scope="col" className="py-3">
                  Name
                </th>
                <th scope="col" className="py-3">
                  Wins
                </th>
                <th scope="col" className="py-3">
                  Losses
                </th>
                <th scope="col" className="py-3">
                  Win Ratio
                </th>
              </tr>
            </thead>
            <tbody>
              {users.data?.slice((pageNum - 1) * indexing, (pageNum - 1) * indexing + indexing).map((user, index) => {
                return (
                  <tr key={index + 1} className="border-b bg-white">
                    <td className="py-3 text-center">{index + 1}</td>
                    <td className="py-3 text-center">
                      <Link href={"/profile/" + user.id}>{user.name}</Link>
                    </td>
                    <td className="py-3 text-center">{user.wins}</td>
                    <td className="py-3 text-center">{user.losses}</td>
                    <td className="flex justify-center py-3 text-center">
                      <WinRateBar wins={user.wins} losses={user.losses} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="m-8 flex w-40 justify-center">
          <div className="flex">
            {pageNum === 1 ? <p className="w-6"></p> : <ChevronLeft onClick={() => setPageNum(pageNum - 1)} />}
            {[...Array(noOfPages)].map((e, i) => (
              <button className="mx-2" key={i} onClick={() => setPageNum(i + 1)}>
                {i + 1}
              </button>
            ))}
            {pageNum === noOfPages ? <p className="w-6"></p> : <ChevronRight onClick={() => setPageNum(pageNum + 1)} />}
          </div>
        </div>
      </main>
    </>
  );
}

export default Leaderboard;

export const WinRateBar = ({ ...props }: { wins: number; losses: number; classList?: string }) => {
  const winRate = Math.round((props.wins / (props.wins + props.losses)) * 100);

  return (
    <div className={props.classList}>
      <div className={"absolute z-20 mt-[2px] flex h-4 w-[100px] items-center justify-evenly rounded-sm text-center text-[10px] text-gray-500"}>
        <p className="truncate">{props.wins}W</p>
        <p className="truncate">{Number.isNaN(winRate) ? "0" : winRate}%</p>
        <p className="truncate">{props.losses}L</p>
      </div>
      <div className={"absolute z-10 h-4 rounded-sm bg-blue-300"} style={{ width: Number.isNaN(winRate) ? "0" : winRate }}></div>
      <div className={"grid h-4 w-[100px] grid-flow-col place-content-stretch rounded-sm bg-red-300 text-[10px]"} />
    </div>
  );
};
