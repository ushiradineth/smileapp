import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { api } from "../utils/api";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyled from "../utils/Global.styled";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <GlobalStyled />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer pauseOnFocusLoss={false} newestOnTop />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default api.withTRPC(MyApp);
