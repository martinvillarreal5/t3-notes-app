import type { Folder } from "@prisma/client";
import type { FolderMinimalInfo } from "~/types/minimalTypes";
import { useState } from "react";
import { api } from "~/utils/api";
import Modal from "../ui/headlessUIModal";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  parentTitle?: string;
  parentId?: string | null;
  folders?: FolderMinimalInfo[] | Folder[]; //Find a way to make this prop required when parentId is not specified as prop
};

const CreateFolderModal = ({
  isOpen,
  setIsOpen,
  parentTitle,
  parentId = null,
  folders,
}: ModalProps) => {
  const [folderTitle, setFolderTitle] = useState("");
  const [Error, setError] = useState("");

  const ctx = api.useContext();

  const createFolder = api.folder.create.useMutation({
    onError(error) {
      void setError(error.message);
      console.log("Error creating folder: " + error.message);
    },
    onSuccess: () => {
      parentId
        ? void ctx.folder.getById.invalidate({ folderId: parentId })
        : void ctx.folder.getManyByParentFolderId.invalidate({
            parentFolderId: null,
          });
      void ctx.folder.getFoldersTree.invalidate();
      void setError("");
      void setFolderTitle(""); //? Necesary?
      void setIsOpen(false);
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!parentId) {
      // If the folder is a root level folder (has no parent)
      if (folders?.some((folder) => folder.title === folderTitle)) {
        //? the unique compuound constraint of the prisma model wont work because i doesnt that field
        //? with null values as equal. So even if they have the same title, the parentId is null and
        //? prisma will take it as diferent values
        //? https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unique-1
        //? https://github.com/prisma/prisma/issues/3197console.log("Repeated folder title");
        setError(
          "Folder title is already used by another folder in this directory"
        );
        return;
      }
    }

    createFolder.mutate({
      title: folderTitle,
      parentFolderId: parentId,
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create Folder"
      description={
        parentTitle
          ? `Add a new sub-folder in the '${parentTitle}' directory to your account.`
          : `Add a new folder to your account.`
        // `Add a new folder in the 'Folders' directory to your account.`
      }
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="folderTitle"
          placeholder="Folder Title"
          className="input-bordered input input-sm sm:input-md mt-2.5 w-full"
          autoComplete="off"
          value={folderTitle}
          onChange={(e) => setFolderTitle(e.target.value)}
        />
        {Error && <p className="text-error my-2">{Error}</p>}
        <div className="modal-action ">
          <button type="submit" className="btn-success btn">
            Save
          </button>
          <button
            type="button"
            className="btn-error btn"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFolderModal;
