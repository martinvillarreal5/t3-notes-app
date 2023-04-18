import { useState } from "react";
import Drawer from "../ui/headlessUIDrawer";
import VerticalNavbar from "./verticalNavbar";
import Topbar from "./topbar";

type layoutProps = {
  extraNavbarContent?: React.ReactNode;
  children: React.ReactNode;
};

const Layout = ({ extraNavbarContent, children }: layoutProps) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  return (
    <>
      <Topbar
        setIsNavDrawerOpen={setIsNavDrawerOpen}
        mobileTopbarContent={extraNavbarContent}
      />
      <Drawer isOpen={isNavDrawerOpen} setIsOpen={setIsNavDrawerOpen}>
        <VerticalNavbar />
      </Drawer>
      <div className="overflow-hidden">
        <div className="mx-auto	max-w-[90rem] px-4 pt-4 sm:px-6 md:px-8">
          <div
            className="border-neutral fixed 
              inset-0 left-[max(0px,calc(50%-45rem))] right-auto
              top-[3rem] z-10 hidden w-[19.5rem]
              overflow-y-auto border-r px-8
              pb-10 pt-8
              lg:top-[4.25625rem] lg:block
            "
          >
            <VerticalNavbar />
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
