import React, { useState } from "react";
import { TabbedMenu, TabbedMenuBody, TabbedMenuTabLeft, TabbedMenuTabRight, TabbedMenuTabs } from "../components/TabbedMenu";
import { Login } from "../components/auth/Login";
import { Register } from "../components/auth/Registration";
import Head from "next/head";
import { useSession } from "next-auth/react";

const Auth = () => {
  const [loginMenu, setLoginMenu] = useState(true);
  const { data: session, status } = useSession();

  console.log(session);

  return (
    <>
      <Head>
        <title>{loginMenu ? "Login" : "Register"} • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TabbedMenu>
        <TabbedMenuTabs>
          {status}
          <TabbedMenuTabLeft text={"Login"} state={!loginMenu} onClick={() => setLoginMenu(true)} />
          <TabbedMenuTabRight text={"Register"} state={loginMenu} onClick={() => setLoginMenu(false)} />
        </TabbedMenuTabs>
        <TabbedMenuBody>{loginMenu ? <Login /> : <Register />}</TabbedMenuBody>
      </TabbedMenu>
    </>
  );
};

export default Auth;
