import { type Folder } from "@prisma/client";
import Link from "next/link";

type folderGridProps = {
  folders: Folder[];
};

const FoldersGrid = ({ folders }: folderGridProps) => {
  return (
    <div
      className="grid 
        grid-cols-4 gap-2
        min-[364px]:grid-cols-5 
        xs:grid-cols-5 
        sm:grid-cols-6 md:grid-cols-6
        md:gap-4 
        lg:grid-cols-8 
        xl:grid-cols-10
        2xl:grid-cols-12"
    >
      {folders.map((folder) => (
        <Link
          href={`/folders/${folder.id}`}
          key={folder.id}
          className="folder h-12
          items-end justify-start
          px-1 py-1 normal-case shadow-xl
          min-[500px]:px-2 "
        >
          <p
            className="m-0 truncate 
          text-xs text-base-content 
          min-[500px]:text-sm sm:text-sm md:text-base xl:text-lg"
          >
            {folder.title}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default FoldersGrid;
