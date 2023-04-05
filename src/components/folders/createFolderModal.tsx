import Modal from "../ui/headlessUIModal";
import { useState } from "react";
import { api } from "~/utils/api";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  parentTitle?: string;
  parentId?: string | null;
};

const CreateFolderModal = ({
  isOpen,
  setIsOpen,
  parentTitle,
  parentId = null,
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
      void setError("");
      void setFolderTitle(""); //? Necesary?
      void setIsOpen(false);
      parentId
        ? void ctx.folder.getById.invalidate({ folderId: parentId })
        : void ctx.folder.getManyByParentFolderId.invalidate({
            parentFolderId: null,
          });
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      folderTitle: { value: string };
    };
    createFolder.mutate({
      title: target.folderTitle.value,
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
