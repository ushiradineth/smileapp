import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Leaderboard() {
  const router = useRouter();
  const { status } = useSession();
  const users = api.userRouter.getLeaderboard.useQuery({ page: Number(router.query.page) || 1 }, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" });

  if (users.isLoading) return <Loader />;
  if (users.isError || !users.data) return <Error text="Leaderboard failed to load" />;

  return (
    <>
      <Head>
        <title>Leaderboard • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative shadow-md my-20">
        <table className="sm:w-[320px] w-screen md:w-[700px] text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center dark:bg-gray-700 dark:text-gray-400">
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
                      <div>
                        <div className={"absolute z-20 rounded-sm h-4 w-[100px] text-[10px] grid grid-flow-col place-content-stretch"}>
                          <p className="truncate">{user.wins}W</p>
                          <p className="truncate">{Number.isNaN(winRate) ? "0" : winRate}%</p>
                          <p className="truncate">{user.losses}L</p>
                        </div>
                        <div className={`absolute z-10 rounded-sm h-4 w-[${winRate}px] bg-blue-300`}></div>
                        <div className={"rounded-sm h-4 w-[100px] text-[10px] bg-red-300 grid grid-flow-col place-content-stretch"} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </>
  );
}

export default Leaderboard;
