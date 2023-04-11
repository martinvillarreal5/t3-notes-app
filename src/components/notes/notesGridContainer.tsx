import NotesGrid from "./notesGrid";

type NoteMinimalInfo = {
  id: string;
  title: string | null;
  content: string;
};

const NotesGridContainer = ({
  notes,
  dataStatus,
}: {
  notes: NoteMinimalInfo[] | undefined;
  dataStatus: string;
}) => {
  return (
    <div className="grow">
      {dataStatus === "loading" && (
        <p className="py-4 text-2xl ">Loading Notes</p>
      )}
      {dataStatus === "error" && (
        <p className="text-error py-4 text-2xl ">
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
