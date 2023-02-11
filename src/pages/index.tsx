import { LogOut, User } from "lucide-react";
import { type ReactNode } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image.js";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/DropdownMenu";
import { AiFillCaretDown, AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";

const Index: NextPage = () => {
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <>
      <Head>
        <title>Welcome to SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div id="container" className="font-cal h-screen w-full flex flex-col items-center">
          <div id="navbar" className="w-full h-fit pt-[25px] md:pb-[25px] flex items-center px-6 gap-4 md:gap-8 relative max-w-[1024px]">
            <Link href={"/"}>
              <Image src="/logo-black.png" height={70} width={120} className="w-24 md:w-full" alt={"logo"} />
            </Link>
            <div className="flex gap-4 object-right absolute right-6 w-full justify-end">
              <Link href={"https://github.com/ushiradineth/smileapp"}>
                <AiFillGithub className="h-6 w-6" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="select-none outline-none flex items-center">
                  <FaUserCircle className="h-6 w-6" />
                  <AiFillCaretDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={10} align="center">
                  <DropdownMenuItem>
                    <Link href={"/leaderboard"} className="w-full flex items-center">
                      <DropdownMenuLabel>
                        <MdOutlineLeaderboard className="h-4 w-4" />
                      </DropdownMenuLabel>
                      <p className="pr-2">Leaderboard</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/profile/${session?.user.handle}`} className="w-full flex items-center">
                      <DropdownMenuLabel>
                        <User className="h-4 w-4" />
                      </DropdownMenuLabel>
                      <p className="pr-2">Profile</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {status === "unauthenticated" ? (
                      <button onClick={() => signIn()}>Sign In</button>
                    ) : (
                      <button onClick={() => signOut()} className="flex items-center">
                        <DropdownMenuLabel>
                          <LogOut className="h-4 w-4" />
                        </DropdownMenuLabel>
                        <p>Log out</p>
                      </button>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div id="slides" className="max-w-[1024px]">
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
          </div>
          <div id="footer" className="w-full h-fit mt-[12px] bg-black flex justify-center">
            <div className="h-fit max-w-[1024px] w-full text-white flex items-center p-2 text-[10px] md:text-[20px]">
              <Image src="/logo-white.png" height={70} width={120} className="h-[35px] w-[60px] m-4 md:m-8 md:h-[70px] md:w-[120px]" alt={"logo"} />
              <div className="w-full flex flex-col justify-end m-4 md:m-8">
                <p className="flex justify-end">Ushira Dineth</p>
                <div className="flex flex-col md:flex-row-reverse md:gap-4 items-end md:items-center">
                  <p>2214787</p>
                  <Link href={"mailto:ushiradineth@gmail.com"}>ushiradineth@gmail.com</Link>
                  <div className="flex gap-2">
                    <Link href={"https://github.com/ushiradineth/smileapp"}>
                      <AiFillGithub className="h-4 w-4 md:h-6 md:w-6" />
                    </Link>
                    <Link href={"https://www.linkedin.com/in/ushiradineth/"}>
                      <AiFillLinkedin className="h-4 w-4 md:h-6 md:w-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-2 py-2">
        <button className="flex w-full select-none items-center justify-center gap-2 rounded-full bg-white from-red-300 via-pink-300 to-orange-100 px-8 py-3 font-semibold text-black no-underline transition hover:bg-gradient-to-br" onClick={() => signIn("github")}>
          github
        </button>
      </main> */}
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
