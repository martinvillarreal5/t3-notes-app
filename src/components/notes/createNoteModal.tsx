import { useState } from "react";
import { api } from "~/utils/api";
import Modal from "../ui/headlessUIModal";
type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  folderId?: string | null;
  folderTitle?: string;
};

const CreateNoteModal = ({
  isOpen,
  setIsOpen,
  folderId = null,
  folderTitle,
}: ModalProps) => {
  const [noteContent, setNoteContent] = useState("");

  const ctx = api.useContext();
  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      folderId
        ? void ctx.folder.getById.invalidate({ folderId: folderId })
        : void ctx.note.getByFolderId.invalidate({
            folderId: null,
          });
      void setIsOpen(false);
      void setNoteContent("");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createNote.mutate({
      content: noteContent,
      folderId: folderId,
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create Note"
      description={
        folderTitle
          ? `Add a new note in the "${folderTitle}" folder to your account.`
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

export default CreateNoteModal;
