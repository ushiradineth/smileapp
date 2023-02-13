import { useRef } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { api } from "../utils/api";
import { DefaultUserImage } from "../utils/default";

const Settings: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const name = useRef<HTMLInputElement | null>(null);
  const image = "ASD";

  const updateUser = api.userRouter.updateUser.useMutation();

  status === "loading" ? <Loader /> : null;

  return (
    <>
      <Head>
        <title>{session?.user?.name} on SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="min-h-screen w-full bg-red-300">
          <Image src={session?.user?.image || DefaultUserImage} className={"rounded-full"} height={200} width={200} alt={"User Image"} />
          <input ref={name} defaultValue={session?.user.name || ""} placeholder="Name" />
          <button disabled={session?.user.name !== name.current?.value && session?.user.image !== image} className="bg-black disabled:bg-blue-300 disabled:cursor-pointer" onClick={() => updateUser.mutate({ id: session?.user.id || "", name: name.current?.value || "", image })}>
            asd
          </button>
        </div>
      </main>
    </>
  );
};

export default Settings;
