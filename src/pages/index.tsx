import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <Layout home>
        <Link href={"/login"}>
          <p className="pb-1 text-2xl text-white underline">Account</p>
        </Link>
        {sessionData?.user !== undefined && (
          <Link href={"/folders"}>
            <p className="pb-1 text-2xl text-white underline">Your Folders</p>
          </Link>
        )}
      </Layout>
    </>
  );
};

export default Home;
