import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../utils/api";

function Leaderboard() {
  const router = useRouter();
  const users = api.userRouter.getLeaderboard.useQuery({ page: Number(router.query.page) || 1 });

  return (
    <>
      <Head>
        <title>Leaderboard • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Wins
                </th>
                <th scope="col" className="px-6 py-3">
                  Losses
                </th>
                <th scope="col" className="px-6 py-3">
                  Win Ratio
                </th>
              </tr>
            </thead>
            <tbody>
              {users.data?.map((user, index) => {
                const winRate = Math.round((user.wins / (user.wins + user.losses)) * 100);
                return (
                  <tr key={index + 1} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 ">
                    <td className="text-center py-3">{index + 1}</td>
                    <td className="text-center py-3">{user.name}</td>
                    <td className="text-center py-3">{user.wins}</td>
                    <td className="text-center py-3">{user.losses}</td>
                    <td className="text-center py-3">
                      <div className="flex justify-center">
                        <div className={`absolute rounded-sm h-4 w-[${winRate}px] bg-blue-300`}></div>
                        <div className={"rounded-sm h-4 w-[100px] text-[10px] bg-red-300 grid grid-flow-col place-content-stretch"}>
                          <p className="truncate">{user.wins}W</p>
                          <p className="truncate">{Number.isNaN(winRate) ? "0" : winRate}%</p>
                          <p className="truncate">{user.losses}L</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default Leaderboard;
