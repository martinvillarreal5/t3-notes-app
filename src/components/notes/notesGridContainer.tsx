import type { Note } from "@prisma/client";
import NotesGrid from "./notesGrid";

const NotesGridContainer = ({
  notes,
  dataStatus,
}: {
  notes: Note[] | undefined;
  dataStatus: string;
}) => {
  return (
    <div className="grow">
      {dataStatus === "loading" && (
        <p className="pb-1  text-sm ">Loading Notes</p>
      )}
      {dataStatus === "error" && (
        <p className="text-error pb-1  text-sm ">
          An error ocurred fetching your notes
        </p>
      )}
      {dataStatus === "success" &&
        (notes && notes.length > 0 ? (
          <NotesGrid notes={notes} />
        ) : (
          <p className="pb-1 text-sm">You dont have any note yet.</p>
        ))}
    </div>
  );
};

export default NotesGridContainer;
