import React, { type ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Loader from "./Loader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/DropdownMenu";
import { AiFillCaretDown, AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { MdOutlineLeaderboard } from "react-icons/md";
import { Dices, Gamepad2, Github, LogIn, LogOut, Settings, User } from "lucide-react";
import localFont from "@next/font/local";

export const CalSans = localFont({
  src: [
    {
      path: "../../public/CalSans-SemiBold.ttf",
    },
  ],
  variable: "--font-cal",
});

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    router.events.on("routeChangeStart", closeMenu);
    return () => router.events.off("routeChangeStart", closeMenu);
  }, [router.events]);

  if (status === "unauthenticated" && router.pathname !== "/" && router.pathname !== "/guest" && router.pathname !== "/auth") router.push("/");
  if (status === "authenticated" && router.pathname !== "/" && router.pathname === "/auth") router.push("/");
  if (status === "loading") return <Loader />;
  if (router.query.initial) {
    location.reload();
    router.push("/");
  } else if (session?.user.name === "name" && router.pathname !== "/settings") router.push("/settings?setName=true");

  return (
    <main className="relative flex h-full justify-center">
      <div id="container" className={`flex min-h-screen w-full flex-col items-center font-cal ${CalSans.variable}`}>
        <div id="navbar" className="relative flex h-fit w-full max-w-[1024px] items-center gap-4 border-b bg-white px-4 pt-[25px] pb-[25px] text-black md:gap-8 md:px-10">
          <Link href={"/"} className="z-10">
            <Image src="/logo-black.png" height={70} width={120} className="w-24 md:w-full" alt={"logo"} priority />
          </Link>
          <div className="absolute right-4 flex w-full justify-end gap-4 object-right md:right-10">
            <Link href={"https://github.com/ushiradineth/smileapp"}>
              <Github className="h-6 w-6" />
            </Link>
            <DropdownMenu open={isOpen} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="flex select-none items-center outline-none">
                <User className="h-6 w-6" />
                <AiFillCaretDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 md:mr-10">
                <LinkItem link="/play" icon={<Gamepad2 className="h-4 w-4" />} title="Play" hidden={status === "unauthenticated"} />
                <LinkItem link="/levels" icon={<Dices className="h-4 w-4" />} title="Levels" hidden={status === "unauthenticated"} />
                <LinkItem link="/leaderboard" icon={<MdOutlineLeaderboard className="h-4 w-4" />} title="Leaderboard" hidden={status === "unauthenticated"} />
                <LinkItem link="/guest" icon={<Gamepad2 className="h-4 w-4" />} title="Guest Play" hidden={status === "authenticated"} />
                <DropdownMenuSeparator className={`${status === "unauthenticated" ? "hidden" : ""}`} />
                <LinkItem link={`/profile/${session?.user.id}`} icon={<User className="h-4 w-4" />} title="Profile" hidden={status === "unauthenticated"} />
                <LinkItem link="/settings" icon={<Settings className="h-4 w-4" />} title="Settings" hidden={status === "unauthenticated"} />
                {status === "unauthenticated" ? <ButtonItem onClick={() => router.push("/auth")} icon={<LogIn className="h-4 w-4" />} title="Sign In" /> : <ButtonItem onClick={() => signOut()} icon={<LogOut className="h-4 w-4" />} title="Log out" />}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className="max-w-[1024px]">{children}</main>
        <div id="footer" className="absolute bottom-0 flex h-fit w-full justify-center bg-black">
          <div className="flex h-fit w-full max-w-[1024px] items-center p-2 text-[10px] text-white md:text-[20px]">
            <Image src="/logo-white.png" height={70} width={120} className="m-4 h-[35px] w-[60px] md:m-8 md:h-[70px] md:w-[120px]" alt={"logo"} priority />
            <div className="m-4 flex w-full flex-col justify-end md:m-8">
              <p className="flex justify-end">Ushira Dineth</p>
              <div className="flex flex-col items-end md:flex-row-reverse md:items-center md:gap-4">
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
      <Link href={props.link} className="flex w-full items-center">
        <DropdownMenuLabel>{props.icon}</DropdownMenuLabel>
        <p>{props.title}</p>
      </Link>
    </DropdownMenuItem>
  );
}

function ButtonItem({ ...props }: { icon: JSX.Element; title: string; hidden?: boolean; onClick: (...args: any[]) => unknown }) {
  return (
    <DropdownMenuItem className={`${props.hidden ? "hidden" : ""}`}>
      <button onClick={props.onClick} className={"flex h-full w-full items-center"}>
        <DropdownMenuLabel>{props.icon}</DropdownMenuLabel>
        <p>{props.title}</p>
      </button>
    </DropdownMenuItem>
  );
}
