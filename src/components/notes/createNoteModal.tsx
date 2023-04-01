import { useState } from "react";
import Modal from "../ui/headlessUIModal";
type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  createFunction: (noteContent: string) => void;
  folderTitle?: string;
};

const CreateNoteModal = ({
  isOpen,
  setIsOpen,
  createFunction,
  folderTitle,
}: ModalProps) => {
  const [noteContent, setNoteContent] = useState("");
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      noteContent: { value: string };
    };
    createFunction(target.noteContent.value);
    setNoteContent("");
  };
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create Note"
      description={
        folderTitle
          ? `Add a new note in "${folderTitle}" to your account.`
          : "Add a new note to your account."
      }
    >
      <form onSubmit={handleSubmit}>
        <textarea
          name="noteContent"
          className=" textarea-bordered textarea mt-2.5 h-80 w-full"
          placeholder="Note Content"
          autoComplete="off"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <div className="modal-action gap-2">
          <button type="submit" className="btn-success btn">
            Save
          </button>
          <button
            type="button"
            className="btn-error btn "
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateNoteModal;
