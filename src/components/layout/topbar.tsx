import { Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/utils/cnHelper";

type TopbarProps = {
  setIsNavDrawerOpen?: (value: React.SetStateAction<boolean>) => void;
  mobileTopbarContent?: React.ReactNode;
  home?: boolean;
};

const Topbar = ({
  setIsNavDrawerOpen,
  mobileTopbarContent,
  home = false,
}: TopbarProps) => {
  return (
    <div
      className={cn(
        home ? `border-b` : `lg:border-b`,
        `bg-base-300 border-neutral sticky top-0 z-20
      w-full lg:border-b`
      )}
    >
      <div className="bg-base-300  mx-auto max-w-[90rem] ">
        <div
          className={cn(
            !home && `border-b`,
            `bg-base-300 border-neutral mx-4 py-4 lg:mx-0 lg:border-0 lg:px-8 `
          )}
        >
          <Link href="/">
            <p className="overflow-y-hidden text-2xl font-extrabold lg:text-3xl">
              T3 <span className="text-accent">Note</span> App
            </p>
          </Link>
        </div>
        {!home && (
          <div className="border-neutral border-b p-4 lg:hidden ">
            <div className="flex w-full items-center">
              {setIsNavDrawerOpen && (
                <button
                  title="open menu"
                  className="btn-ghost btn-square btn-sm btn mr-4"
                  onClick={() => setIsNavDrawerOpen(true)}
                >
                  <MenuIcon />
                </button>
              )}
              {mobileTopbarContent && mobileTopbarContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
