import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Trash2 as TrashIcon } from "lucide-react";

type DeleteNoteButtonProps = {
  noteId: string;
  folderId?: string | null;
};

const DeleteNoteButton = ({
  noteId,
  folderId = null,
}: DeleteNoteButtonProps) => {
  const router = useRouter();
  const ctx = api.useContext();
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      if (folderId) {
        void ctx.folder.getById.invalidate({ folderId: folderId });
        //void router.push(`/folders/${note.folderId}`);
        void router.back();
      } else {
        void ctx.note.getRootNotes.invalidate();
        //void router.push(`/folders`);
        void router.back();
      }
    },
  });
  return (
    <button
      title="Delete this note"
      className="btn-square btn-sm btn"
      onClick={() => deleteNote.mutate({ noteId: noteId })}
      disabled={deleteNote.isLoading}
    >
      <TrashIcon />
    </button>
  );
};

export default DeleteNoteButton;
