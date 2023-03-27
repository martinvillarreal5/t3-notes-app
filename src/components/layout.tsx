import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

type layoutProps = {
  children: React.ReactNode;
  home?: boolean;
};

/* 
fro navbar check https://www.radix-ui.com/docs/primitives/components/navigation-menu#with-client-side-routing


*/

const Layout = ({ children, home }: layoutProps) => {
  const { status } = useSession();
  const siteTitle = "T3 Notes App";
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Generated by create-t3-app" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <div
        className="mx-auto flex min-h-screen w-full flex-col bg-base-300 px-2	 2xl:container sm:px-4"
        // xl:max-w-7xl
      >
        <div className="navbar  px-0">
          <div className=" py-2 sm:py-4">
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl ">
              T3 <span className="text-accent">Note</span> App
            </p>
          </div>
        </div>

        <main className="flex grow flex-row gap-0 lg:gap-4">
          <nav className="hidden min-w-[15.5rem] flex-col lg:flex">
            <ul>
              <li className="pb-4 text-xl">
                <Link href="/">Home</Link>
              </li>
              {status === "loading" && <li>Loading</li>}
              <li className="pb-4 text-xl ">
                <Link href={"/login"}>
                  {status === "authenticated" ? "Account" : "Log in"}
                </Link>
              </li>
              {status === "authenticated" && (
                <li className="pb-4 text-xl ">
                  <Link href={"/folders"}>Your Folders</Link>
                </li>
              )}
            </ul>
          </nav>
          <div
            className="flex grow flex-col"
            //lg:basis-4/5
          >
            {children}
          </div>
        </main>
        {/* <footer className="">
          {!home && (
            <p className="pb-8 pt-4 text-xl underline">
              <Link href="/">← Back to home</Link>
            </p>
          )}
        </footer> */}
      </div>
    </>
  );
};

export default Layout;
