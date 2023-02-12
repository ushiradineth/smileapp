import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../../components/Error";
import Loader from "../../components/Loader";
import { api } from "../../utils/api";
import Image from "next/image";
import { DefaultUserImage } from "../../utils/default";

const Profile: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const profile = api.userRouter.getUser.useQuery({ id: router.query.profile as string }, { retry: false, refetchOnWindowFocus: false, enabled: typeof router.query.profile !== "undefined" && status === "authenticated" });

  if (profile.isLoading) return <Loader />;
  if (profile.isError) return <Error text="User not found" />;

  return (
    <>
      <Head>
        <title>{profile.data?.name} on SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="min-h-screen w-full bg-red-300">
          <Image src={profile.data?.image || DefaultUserImage} className={"rounded-full"} height={200} width={200} alt={"User Image"}/>
          <p>{profile.data?.name}</p>
          <p>{profile.data?.email}</p>
          <p>{profile.data?.wins.length}</p>
          <p>{profile.data?.losses.length}</p>
          <p>{profile.data?.highestStreak}</p>
        </div>
      </main>
    </>
  );
};

export default Profile;
