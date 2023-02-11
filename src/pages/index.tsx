import { type ReactNode } from "react";
import { type NextPage } from "next";
import Head from "next/head";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Block>
          <Details title="TEST YOUR INTELECT WITH THIS SIMPLE AND FUN GAME" description="Simple, easy and interactive gameplay" />
          <Placeholder />
        </Block>
        <Block reverse={true}>
          <Placeholder />
          <Details title="TRACK YOUR PERSONAL PERFORMANCE" description="Insights on your ups and downs" textRight={true} />
        </Block>
        <Block>
          <Details title="COMPETE WITH YOUR FRIENDS" description="See who can rank higher in the Leaderboard" />
          <Placeholder />
        </Block>
      </main>
    </>
  );
};

function Block({ children, ...props }: { children: ReactNode; reverse?: boolean }) {
  return <div className={`flex ${props.reverse === true ? "flex-col-reverse" : "flex-col"} md:flex-row items-center py-[10px] md:py-[25px] md:px-10 px-4 `}>{children}</div>;
}

function Details(props: { title: string; description: string; textRight?: boolean }) {
  return (
    <div className={`w-full flex flex-col items-center py-8 ${props.textRight === true ? "md:items-end md:pl-8" : "md:items-start md:pr-8"}`}>
      <p className={`text-[20px] md:text-[48px] text-center flex  ${props.textRight === true ? "md:text-end" : "md:text-start"}`}>{props.title}</p>
      <p className={`text-[10px] md:text-[24px] text-center flex w-fit ${props.textRight === true ? "md:text-end" : "md:text-start"}`}>{props.description}</p>
    </div>
  );
}

function Placeholder() {
  return (
    <>
      <div className="h-[250px] lg:h-[400px] aspect-square bg-zinc-500 grid place-items-center">
        <p className="text-[12px] lg:text-[24px]">PLACEHOLDER FOR IMAGE</p>
      </div>
      {/* <Image src="/logo-black.png" height={400} width={400} alt="placeholder" /> */}
    </>
  );
}

export default Index;
