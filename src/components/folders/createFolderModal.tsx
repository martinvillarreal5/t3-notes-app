import Modal from "../ui/headlessUIModal";
import { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  createFunction: (folderTitle: string) => void;
  parentTitle?: string;
};

const CreateFolderModal = ({
  isOpen,
  setIsOpen,
  createFunction,
  parentTitle,
}: ModalProps) => {
  const [folderTitle, setFolderTitle] = useState("");
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      folderTitle: { value: string };
    };
    createFunction(target.folderTitle.value); //i can probably use folderTitle instead
    setFolderTitle("");
  };
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create Folder"
      description={
        parentTitle
          ? `Add a new sub-folder in the ${parentTitle}' directory to your account.`
          : `Add a new folder to your account.`
        // `Add a new folder in the 'Folders' directory to your account.`
      }
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="folderTitle"
          placeholder="Folder Title"
          className="input-bordered input input-sm mt-2.5 w-full sm:input-md"
          autoComplete="off"
          value={folderTitle}
          onChange={(e) => setFolderTitle(e.target.value)}
        />
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
