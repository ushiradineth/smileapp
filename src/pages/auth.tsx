import React, { useState } from "react";
import { TabbedMenu, TabbedMenuBody, TabbedMenuTabLeft, TabbedMenuTabRight, TabbedMenuTabs } from "../components/ui/TabbedMenu";
import { Login } from "../components/auth/Login";
import { Register } from "../components/auth/Registration";
import Head from "next/head";

const Auth = () => {
  const [loginMenu, setLoginMenu] = useState(true);

  return (
    <>
      <Head>
        <title>{loginMenu ? "Login" : "Register"} • SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-24 mb-60">
        <TabbedMenu>
          <TabbedMenuTabs>
            <TabbedMenuTabLeft text={"Login"} state={!loginMenu} onClick={() => setLoginMenu(true)} />
            <TabbedMenuTabRight text={"Register"} state={loginMenu} onClick={() => setLoginMenu(false)} />
          </TabbedMenuTabs>
          <TabbedMenuBody>{loginMenu ? <Login /> : <Register />}</TabbedMenuBody>
        </TabbedMenu>
      </div>
    </>
  );
};

export default Auth;
