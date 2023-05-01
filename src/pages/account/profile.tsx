import type { NextPage } from "next";
import Layout from "~/components/layout/layout";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Profile: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      console.log(sessionStatus);
      void router.push("/signin");
    }
  }, [router, sessionStatus]);
  return (
    <>
      <Head>
        <meta name="og:title" content="Profile" />
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

export default Profile;
