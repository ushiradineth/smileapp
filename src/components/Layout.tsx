import React, { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/DropdownMenu";
import { AiFillCaretDown, AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { MdOutlineLeaderboard } from "react-icons/md";
import { Github, LogIn, LogOut, Settings, User } from "lucide-react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

export default function Layout({ children }: { children: ReactNode; reverse?: boolean }) {
  const { data: session, status } = useSession();

  return (
    <main className="flex justify-center">
      <div id="container" className="font-cal h-screen w-full flex flex-col items-center">
        <div id="navbar" className="w-full h-fit pt-[25px] md:pb-[25px] flex items-center px-4 md:px-10 gap-4 md:gap-8 relative max-w-[1024px]">
          <Link href={"/"}>
            <Image src="/logo-black.png" height={70} width={120} className="w-24 md:w-full" alt={"logo"} />
          </Link>
          <div className="flex gap-4 object-right absolute right-4 md:right-10 w-full justify-end">
            <Link href={"https://github.com/ushiradineth/smileapp"}>
              <Github className="h-6 w-6" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="select-none outline-none flex items-center">
                <User className="h-6 w-6" />
                <AiFillCaretDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 md:mr-10">
                <LinkItem link="/leaderboard" icon={<MdOutlineLeaderboard className="h-4 w-4" />} title="Leaderboard" hidden={status === "unauthenticated"} />
                <DropdownMenuSeparator className={`${status === "unauthenticated" ? "hidden" : ""}`} />
                <LinkItem link={`/profile/${session?.user.handle}`} icon={<User className="h-4 w-4" />} title="Profile" hidden={status === "unauthenticated"} />
                <LinkItem link="/settings" icon={<Settings className="h-4 w-4" />} title="Settings" hidden={status === "unauthenticated"} />
                <DropdownMenuItem>{status === "unauthenticated" ? <ButtonItem onClick={() => signIn()} icon={<LogIn className="h-4 w-4" />} title="Sign In" /> : <ButtonItem onClick={() => signOut()} icon={<LogOut className="h-4 w-4" />} title="Log out" />}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className="max-w-[1024px]">{children}</main>
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
  );
}

function LinkItem({ ...props }: { icon: JSX.Element; title: string; link: string; hidden: boolean }) {
  return (
    <DropdownMenuItem className={`${props.hidden ? "hidden" : ""}`}>
      <Link href={props.link} className="w-full flex items-center">
        <DropdownMenuLabel>{props.icon}</DropdownMenuLabel>
        <p>{props.title}</p>
      </Link>
    </DropdownMenuItem>
  );
}

function ButtonItem({ ...props }: { icon: JSX.Element; title: string; onClick: (...args: any[]) => unknown }) {
  return (
    <button onClick={props.onClick} className="flex items-center">
      <DropdownMenuLabel>{props.icon}</DropdownMenuLabel>
      <p>{props.title}</p>
    </button>
  );
}
