import { useSession } from "next-auth/react";
import Link from "next/link";
import FolderTree from "./folderTree";

const NavbarItem = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <li className="hover:bg-neutral-focus focus:bg-neutral-focus w-full rounded-md py-2 pl-1 text-xl">
      <Link href={href}>{children}</Link>
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
