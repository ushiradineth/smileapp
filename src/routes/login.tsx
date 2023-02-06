import { createSignal, JSXElement, Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { db } from "~/db";
import { createUserSession, getUser, login, register } from "~/db/session";
import { authOptions } from "./api/auth/[...solidauth]";
import { getSession } from "@solid-auth/next";
import { signIn, signOut } from "@solid-auth/next/client";
import { AiFillGithub } from "solid-icons/ai";

export const routeData = () => {
  return createServerData$(
    async (_, { request }) => {
      return await getSession(request, authOptions);
    },
    { key: () => ["auth_user"] }
  );
};

function validateEmail(email: unknown) {
  const isEmail = z.string().email().safeParse(email);
  if (!isEmail.success) {
    throw new FormError("Invaild Email");
  }
}

export default function Login() {
  const CTAs = () => {
    const MagicEmail = () => {
      const [emailValidation, setEmailValidation] = createSignal(false);
      const [msg, setMsg] = createSignal("");

      const onChange = (e: { currentTarget: { name: any; value: any } }) => {
        if (e.currentTarget.name === "email") {
          const isEmail = z.string().email().safeParse(e.currentTarget.value);
          if (emailValidation() !== isEmail.success) {
            setEmailValidation(isEmail.success);
          }
        }
      };

      const [MagicEmail, { Form }] = createServerAction$(async (form: FormData) => {
        const email = form.get("email");
        validateEmail(email);

        signIn("email", { email: (document.getElementById("email") as HTMLInputElement).value, redirect: false });
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(1000);
        setMsg("Magic link sent, Check your Email.");
      });

      return (
        <Form class="mt-3 grid w-full gap-1 px-6 text-center">
          <input type="email" name="email" id="email" placeholder="Email" class={"focus:shadow-outline w-full appearance-none rounded-full border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"} onInput={(e) => onChange(e)} />
          <p class={"font-semibold text-green-500"}>{msg()}</p>
          <button type="submit" disabled={!emailValidation()} class="font-semiboldno-underline focus:shadow-outline flex w-full select-none items-center justify-center rounded-full bg-blue-500 from-red-300 via-pink-300 to-orange-100 px-2 py-3 font-semibold text-white transition hover:bg-gradient-to-br hover:text-black focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300">
            Magic Link
          </button>
        </Form>
      );
    };

    const Divider = () => {
      return (
        <div class="relative flex items-center py-5">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="mx-4 flex-shrink select-none text-gray-400">OR</span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>
      );
    };

    return (
      <>
        <MagicEmail />
        <Divider />
        <section class="grid w-[350px] gap-2 rounded px-6 pb-6 pt-2">
          <button class="flex w-full select-none items-center justify-center gap-2 rounded-full bg-white from-red-300 via-pink-300 to-orange-100 px-8 py-3 font-semibold text-black no-underline transition hover:bg-gradient-to-br" onClick={() => signIn("github", { callbackUrl: "localhost:3000" })}>
            <AiFillGithub size={30} />
            Continue with Github
          </button>
        </section>
      </>
    );
  };

  return (
    <main class=" grid h-screen w-screen select-none bg-[#171717]">
      <div class={"grid place-content-center place-items-center gap-4"}>
        <div class="z-10 flex h-full w-full flex-col items-center justify-center rounded-lg shadow-2xl backdrop-blur-2xl">
          <div class="grid h-fit w-fit grid-flow-col place-items-center gap-2 rounded-lg">
            <h1 class="p-8 text-5xl font-extrabold tracking-tight text-white">
              Smile<span class="bg-gradient-to-br from-red-300 via-pink-300 to-orange-100 bg-clip-text text-transparent">App</span>
            </h1>
          </div>
          <CTAs />
        </div>
      </div>
    </main>
  );
}
