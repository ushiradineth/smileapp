import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Error from "../../components/Error";
import Loader from "../../components/Loader";
import { api } from "../../utils/api";

const Profile: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const profile = api.userRouter.getUser.useQuery({ id: router.query.profile as string }, { retry: false, refetchOnWindowFocus: false, enabled: typeof router.query.profile !== "undefined" && status === "authenticated" });

  if (profile.isLoading) return <Loader />;
  if (profile.isError) return <Error text="User not found" />

  return (
    <>
      <Head>
        <title>{profile.data?.name} on SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="min-h-screen">{profile.data?.id}</div>
      </main>
    </>
  );
};

export default Profile;
