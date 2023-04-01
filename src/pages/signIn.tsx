import type { NextPage } from "next";
import Layout from "~/components/layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Head from "next/head";

const Login: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <meta name="og:title" content="Sign In" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </Layout>
    </>
  );
};

export default Login;
