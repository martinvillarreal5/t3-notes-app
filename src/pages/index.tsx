import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Topbar from "~/components/layout/topbar";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <Topbar home />
      <div className="flex flex-col items-center	pt-12">
        <p className="pb-4 text-center text-5xl font-extrabold ">
          Effortlessly create <span className="text-primary">notes</span>,
          organize them in <span className="text-secondary">folders</span>
        </p>
        <p className="pb-6 text-center text-xl">
          Make it easy to keep track of your thoughts, ideas, and projects. Sign
          up today to streamline your note-taking process.
        </p>
        {sessionData?.user ? (
          <Link href="/folders" className="btn-accent btn">
            Get Started
          </Link>
        ) : (
          <button
            className="btn-accent btn"
            onClick={() => void signIn("discord", { callbackUrl: "/folders" })}
          >
            Get Started
          </button>
        )}
      </div>
    </>
  );
};

export default Home;
