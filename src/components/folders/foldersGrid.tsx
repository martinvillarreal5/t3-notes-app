import { type Folder } from "@prisma/client";
import Link from "next/link";

type folderGridProps = {
  folders: Folder[];
};

const FoldersGrid = ({ folders }: folderGridProps) => {
  return (
    <div
      className="grid grid-cols-4 gap-2
        xs:grid-cols-5 
        sm:grid-cols-6 
        md:grid-cols-6 md:gap-4
        lg:grid-cols-8 
        xl:grid-cols-10 
        2xl:grid-cols-12"
    >
      {folders.map((folder) => (
        <Link
          href={`/folders/${folder.id}`}
          key={folder.id}
          className="btn-outline btn col-span-1
          p-1 normal-case"
        >
          <p className=" my-1 truncate text-xs min-[450px]:text-sm  sm:text-sm md:text-base lg:text-lg">
            {folder.title}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default FoldersGrid;
