import { useSession } from "next-auth/react";
import Link from "next/link";
import FolderTree from "../folders/folderTree";
import { useRouter } from "next/router";
import { cn } from "~/utils/cnHelper";

const NavbarItem = ({ children, href }: { children: string; href: string }) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  return (
    <li>
      <Link
        className={cn(
          currentRoute === href && "bg-neutral-focus",
          `block w-full rounded-md py-1 pl-1 
        text-xl hover:bg-neutral-focus focus:bg-neutral-focus`
        )}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
};

const VerticalNavbar = () => {
  const { status } = useSession();

  return (
    <nav>
      <ul>
        <NavbarItem href="/">Home</NavbarItem>
        {status === "loading" && <li>Loading</li>}
        {status === "authenticated" && (
          <>
            <NavbarItem href={"/account/profile"}>Profile</NavbarItem>
            <NavbarItem href={"/folders"}>Your Folders</NavbarItem>
          </>
        )}
      </ul>
      <FolderTree />
    </nav>
  );
};

export default VerticalNavbar;
