import React from "react";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import Link from "next/link";

function Levels() {
  const { status } = useSession();
  const levels = api.levelRouter.getAllLevels.useQuery(undefined, { retry: false, refetchOnWindowFocus: false, enabled: status === "authenticated" });

  return (
    <>
      {levels.data?.map((e) => (
        <div key={e.id}><Link href={"/level/" + e.id}>{e.id}</Link></div>
      ))}
    </>
  );
}

export default Levels;
