import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Layout from "~/components/layout/layout";
import Link from "next/link";

const Home: NextPage = () => {
  const { status, data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center	">
          {status === "loading" && <p>Loading...</p>}
          <p className="pb-4 text-center text-5xl font-extrabold ">
            Effortlessly create <span className="text-primary">notes</span> and
            organize them in <span className="text-secondary">folders</span>
          </p>
          <p className="pb-6 text-center text-xl">
            Make it easy to keep track of your thoughts, ideas, and projects.
            Sign up today to streamline your note-taking process.
          </p>
          {sessionData ? (
            <Link href="/folders" className="btn-accent btn">
              Get Started
            </Link>
          ) : (
            <button className="btn-accent btn" onClick={() => void signIn()}>
              Get Started!
            </button>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Home;
