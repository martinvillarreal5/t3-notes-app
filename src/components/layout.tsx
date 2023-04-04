import { Menu as MenuIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Drawer from "./ui/headlessUIDrawer";

type layoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: layoutProps) => {
  const { status } = useSession();
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <>
      <div className="bg-base-300 border-neutral sticky top-0 z-20 w-full  lg:border-b">
        <div className="bg-base-300  mx-auto max-w-[90rem]  ">
          <div className="bg-base-300 border-neutral mx-4 border-b py-4 lg:mx-0 lg:border-0 lg:px-8 ">
            <Link href="/">
              <p className="text-2xl font-extrabold lg:text-3xl">
                T3 <span className="text-accent">Note</span> App
              </p>
            </Link>
          </div>
          <div className="border-neutral border-b p-4 lg:hidden ">
            <div className="flex w-full items-center">
              <button
                title="open menu"
                className="btn-ghost btn-square btn-sm btn mr-4"
                onClick={() => setIsNavOpen(true)}
              >
                <MenuIcon />
              </button>
              <p className="">Breadcrumbs Here</p>
            </div>
          </div>
        </div>
      </div>
      <Drawer isOpen={isNavOpen} setIsOpen={setIsNavOpen}>
        <nav className="flex w-[15.5rem] flex-col pr-4">
          <ul>
            <li className="pb-4 text-xl">
              <Link href="/">Home</Link>
            </li>
            {status === "loading" && <li>Loading</li>}
            {status === "authenticated" && (
              <li className="pb-4 text-xl ">
                <Link href={"/account/profile"}>Profile</Link>
              </li>
            )}
            {status === "authenticated" && (
              <li className="pb-4 text-xl ">
                <Link href={"/folders"}>Your Folders</Link>
              </li>
            )}
          </ul>
        </nav>
      </Drawer>
      <div className="overflow-hidden">
        <div className="mx-auto	max-w-[90rem] px-4 pt-4 sm:px-6 md:px-8">
          <div
            className="fixed inset-0 
              left-[max(0px,calc(50%-45rem))] right-auto top-[3rem]
              z-10 hidden w-[19.5rem] overflow-y-auto
              px-8 pb-10 pt-8
              lg:top-[4.35rem] lg:block
            "
          >
            <nav className="border-neutral">
              <ul>
                {status === "loading" && <li>Loading</li>}
                {status === "authenticated" && (
                  <li className="pb-4 text-xl ">
                    <Link href={"/account/profile"}>Profile</Link>
                  </li>
                )}
                {status === "authenticated" && (
                  <li className="pb-4 text-xl ">
                    <Link href={"/folders"}>Your Folders</Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          <div className="lg:pl-[19.5rem]">
            <div className="relative z-10 mx-auto max-w-3xl pt-6 xl:max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
