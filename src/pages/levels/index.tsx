import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Error from "../../components/Error";
import Loader from "../../components/Loader";
import { api } from "../../utils/api";

function Levels() {
  const { data: session, status } = useSession();

  const [levels, user] = api.useQueries((t) => [t.levelRouter.getAllLevels(undefined, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" }), t.userRouter.getUser({ id: session?.user.id || "" }, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" })]);

  if (levels.isLoading || user.isLoading) return <Loader />;
  if (levels.isError || !levels.data || user.isError || !user.data) return <Error text="Data not found" />;

  return (
    <>
      {levels.data?.map((e) => (
        <div key={e.id}>
          <Link href={"/level/" + e.id}>
            {e.id}
            {user.data?.rounds.find(l => l.levelId === e.id) ? <>y</> : <>n</>}
          </Link>
        </div>
      ))}
    </>
  );
}

export default Levels;
