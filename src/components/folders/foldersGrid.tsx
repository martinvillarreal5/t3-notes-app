//import { type Folder } from "@prisma/client";
import Link from "next/link";
import type { FolderMinimalInfo } from "~/types/minimalTypes";

type folderGridProps = {
  folders: FolderMinimalInfo[];
};

const FoldersGrid = ({ folders }: folderGridProps) => {
  return (
    <div
      className="
        xs:grid-cols-7 
        grid 
        grid-cols-4
        gap-2 
        min-[345px]:grid-cols-5 
        min-[440px]:grid-cols-6 
        sm:grid-cols-8 
        md:grid-cols-7 md:gap-4 
        lg:grid-cols-7 
        xl:grid-cols-10
        2xl:grid-cols-10"
    >
      {folders.map((folder) => (
        <Link
          href={`/folders/${folder.id}`}
          key={folder.id}
          className="folder h-10
          items-end justify-start
          px-1 py-1 normal-case shadow-xl
          min-[500px]:px-2 sm:h-12 lg:h-14"
        >
          <p
            className="text-base-content m-0 
          truncate text-sm
          sm:text-base lg:text-lg "
          >
            {folder.title}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default FoldersGrid;
