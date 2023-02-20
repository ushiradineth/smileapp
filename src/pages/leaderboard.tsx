import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { api } from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <main className="flex flex-col items-center mt-20 mb-36">
        <div className="shadow-md">
          <table className="sm:w-[320px] w-screen md:w-[700px] text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center">
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
                  <tr key={index + 1} className="bg-white border-b">
                    <td className="text-center py-3">{index + 1}</td>
                    <td className="text-center py-3">{user.name}</td>
                    <td className="text-center py-3">{user.wins}</td>
                    <td className="text-center py-3">{user.losses}</td>
                    <td className="text-center py-3 flex justify-center">
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
  console.log(winRate);
  

  return (
    <div className={props.classList}>
      <div className={"text-gray-500 text-center absolute z-20 rounded-sm h-4 w-[100px] text-[10px] flex justify-evenly items-center mt-[2px]"}>
        <p className="truncate">{props.wins}W</p>
        <p className="truncate">{Number.isNaN(winRate) ? "0" : winRate}%</p>
        <p className="truncate">{props.losses}L</p>
      </div>
      <div className={"absolute z-10 rounded-sm bg-blue-300 h-4"} style={{ 'width': winRate }}></div>
      <div className={"rounded-sm h-4 w-[100px] text-[10px] bg-red-300 grid grid-flow-col place-content-stretch"} />
    </div>
  );
};
