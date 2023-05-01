import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Trash2 as TrashIcon } from "lucide-react";
import { Modal, ModalDescription, ModalPanel, ModalTitle } from "../ui/modal";
import { useState } from "react";

type DeleteNoteButtonProps = {
  noteId: string;
  disabled?: boolean;
  folderId?: string | null;
  noteTitle?: string | null | undefined;
};

const DeleteNoteButton = ({
  noteId,
  noteTitle,
  disabled = false,
  folderId = null,
}: DeleteNoteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const ctx = api.useContext();
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      if (folderId) {
        setIsOpen(false);
        void ctx.folder.getById.invalidate({ folderId: folderId });
        void router.push(`/folders/${folderId}`);
        //void router.back();
      } else {
        void ctx.note.getRootNotes.invalidate();
        void router.push(`/folders`);
        //void router.back();
      }
    },
  });
  return (
    <>
      <button
        type="button"
        title="Delete this note"
        className="btn-square btn-sm btn"
        onClick={() => setIsOpen(true)}
        disabled={disabled || deleteNote.isLoading}
      >
        <TrashIcon />
      </button>
      <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
        <ModalPanel>
          <ModalTitle className={"pb-1 text-xl"}>
            Delete {noteTitle || "this note"}?
          </ModalTitle>
          <ModalDescription className={"pb-4 text-base"}>
            This will permantly remove {noteTitle || "this note"} from your
            folders
          </ModalDescription>
          <div className="flex flex-row justify-between">
            <button
              className="btn btn-error"
              onClick={() => deleteNote.mutate({ noteId: noteId })}
              disabled={deleteNote.isLoading || deleteNote.isSuccess}
            >
              Delete
            </button>
            <button
              className="btn "
              onClick={() => setIsOpen(false)}
              disabled={deleteNote.isLoading || deleteNote.isSuccess}
            >
              Cancel
            </button>
          </div>
        </ModalPanel>
      </Modal>
    </>
  );
};

export default DeleteNoteButton;
