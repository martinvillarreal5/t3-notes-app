import { Menu, Transition } from "@headlessui/react";
import { cn } from "~/utils/cnHelper";
import DeleteFolderButton from "./deleteFolderButton";
import {
  Trash2 as TrashIcon,
  MoreVertical as MenuIcon,
  FolderPlus as FolderPlusIcon,
  FilePlus as FilePlusIcon,
  FolderEdit as FolderEditIcon,
} from "lucide-react";
import { Fragment } from "react";

type FolderMenuProps = {
  folderId: string;
  parentFolderId?: string | null;
};
/* {
  folderId,
  parentFolderId,
}: FolderOptionsMenuProps */
const FolderMenu = () => {
  return (
    <Menu as={"div"} className={"relative inline-block align-bottom "}>
      <Menu.Button
        title="Folder Menu"
        className="btn-square btn-sm btn align-bottom"
      >
        <MenuIcon />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="right-100 bg-base-100 divide-neutral
          absolute z-10 mt-2 w-56 origin-top-left divide-y rounded-md text-left 
         shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <Menu.Item>
            {({ active }) => (
              <div className="px-1 py-1 ">
                <button
                  className={cn(
                    active && "bg-neutral-focus",
                    `group flex w-full items-center rounded-md px-2 py-2 text-sm`
                  )}
                >
                  <FilePlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  New Note
                </button>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className="px-1 py-1">
                <button
                  className={cn(
                    active && "bg-neutral-focus",
                    `group flex w-full items-center rounded-md px-2 py-2 text-sm`
                  )}
                >
                  <FolderPlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  New Sub-Folder
                </button>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className="px-1 py-1 ">
                <button
                  className={cn(
                    active && "bg-neutral-focus",
                    `group flex w-full items-center rounded-md px-2 py-2 text-sm`
                  )}
                >
                  <FolderEditIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Edit Folder
                </button>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className="px-1 py-1 ">
                <button
                  className={cn(
                    active && "bg-neutral-focus",
                    `group flex w-full items-center rounded-md px-2 py-2 text-sm`
                  )}
                >
                  <TrashIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default FolderMenu;
