import { useState } from "react";
import { Drawer, DrawerTitle } from "~/components/ui/drawer";
import {
  Trash2 as TrashIcon,
  MoreVertical as MenuIcon,
  FolderPlus as FolderPlusIcon,
  FilePlus as FilePlusIcon,
  FolderEdit as FolderEditIcon,
} from "lucide-react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

type FolderMenuProps = {
  folderTitle: string;
  folderId: string;
};

const FolderMenu = ({ folderId, folderTitle, ...props }: FolderMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        title="Folder Menu"
        className="btn-square btn-sm btn align-bottom"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </button>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} orientation="right">
        <DrawerTitle className="mb-3 text-3xl">{folderTitle}</DrawerTitle>

        <div
          className="hover:bg-neutral-focus focus:bg-neutral-focus flex 
        w-full items-center rounded-md py-1 pl-1 text-xl"
        >
          <FilePlusIcon className="mr-2 " aria-hidden="true" />
          Add note
        </div>
        <div
          className="hover:bg-neutral-focus focus:bg-neutral-focus flex 
        w-full items-center rounded-md py-1 pl-1 text-xl"
        >
          <FolderEditIcon className="mr-2 " aria-hidden="true" />
          Change title
        </div>
        <div
          className="hover:bg-neutral-focus focus:bg-neutral-focus flex 
        w-full items-center rounded-md py-1 pl-1 text-xl"
        >
          <FolderPlusIcon className="mr-2 " aria-hidden="true" />
          Add sub folder
        </div>
        <div
          className="hover:bg-neutral-focus focus:bg-neutral-focus flex 
        w-full items-center rounded-md py-1 pl-1 text-xl"
        >
          <TrashIcon className="mr-2 " aria-hidden="true" />
          Delete Folder
        </div>
      </Drawer>
    </>
  );
};

export default FolderMenu;
