import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loader from "../components/Loader";
import { env } from "../env.mjs";
import { api } from "../utils/api";
import { DefaultUserImage } from "../utils/default";
import { createClient } from "@supabase/supabase-js";

const Settings: NextPage = () => {
  const { data: session } = useSession();
  const name = useRef<HTMLInputElement | null>(null);
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);
  const updateName = api.userRouter.updateName.useMutation();

  const onSubmit = async () => {
    // let Image = session?.user.image;
    // if (Name !== session?.user.name || typeof image !== "undefined") {
    //   if (typeof image !== "undefined" && imageURL) {
    //     await supabase.storage.from(env.NEXT_PUBLIC_SUPABASE_BUCKET).upload(`/Users/${session?.user.id}/ProfilePicture`, imageURL, {
    //       cacheControl: "1",
    //       upsert: true,
    //     });
    //     Image = `${env.NEXT_PUBLIC_SUPABASE_IMAGE_URL}Users/${session?.user.id}/ProfilePicture`;
    //   }
  };

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Loader />;

  return (
    <>
      <Head>
        <title>{session.user.name} on SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="min-h-screen w-full bg-red-300 ">
          <Image src={session.user.image || DefaultUserImage} className={"rounded-full"} height={200} width={200} alt={"User Image"} />
          <input ref={name} defaultValue={session.user.name || ""} placeholder="Name" />
          <button disabled={session?.user.name !== name.current?.value} onClick={() => updateName.mutate({ id: session?.user.id || "", name: name.current?.value || session.user.name || "" })} className="bg-black disabled:bg-blue-300 disabled:cursor-pointer">
            Change Name
          </button>
          {/* <div className="mb-4 h-24 w-full flex items-center justify-center">
            <button className="cursor-pointer text-sm text-blue-400" onClick={() => imageRef.current?.click()}>
              Change profile picture
            </button>
          </div> */}
        </div>
      </main>
    </>
  );
};

export default Settings;
