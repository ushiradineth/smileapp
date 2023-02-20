import { type ReactNode } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { DefaultBackgroundImage } from "../utils/default";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mb-40">
        <Block>
          <Details title="TEST YOUR INTELECT WITH THIS SIMPLE AND FUN GAME" description="Simple, easy and interactive gameplay" />
          <Placeholder image={"/1.png"} />
        </Block>
        <Block reverse={true}>
          <Placeholder image={"/2.png"} />
          <Details title="TRACK YOUR PERSONAL PERFORMANCE" description="Insights on your ups and downs" textRight={true} />
        </Block>
        <Block>
          <Details title="COMPETE WITH YOUR FRIENDS" description="See who can rank higher in the Leaderboard" />
          <div className="border-2 rounded">
            <Placeholder image={"/3.png"} />
          </div>
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

function Placeholder({ ...props }: { image: string }) {
  return (
    <div className="h-[250px] lg:h-[400px] aspect-square grid place-items-center">
      <Image src={props.image || DefaultBackgroundImage} height={400} width={400} alt="placeholder" />
    </div>
  );
}

export default Index;
