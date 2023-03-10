import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  return (
    <>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <Layout home>
        {status === "loading" && <h2>Loading...</h2>}
        {status === "authenticated" && (
          <>
            <Link href={"/login"}>
              <p className="pb-1 text-2xl text-white underline">Account</p>
            </Link>

            <Link href={"/folders"}>
              <p className="pb-1 text-2xl text-white underline">Your Folders</p>
            </Link>
          </>
        )}
        {/*  {sessionData?.user !== undefined && (
          
        )} */}
      </Layout>
    </>
  );
};

export default Home;
