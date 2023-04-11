//import Link from "next/link";

type NoteMinimalInfo = {
  id: string;
  title: string | null;
  content: string;
};

type notesGridProps = {
  notes: NoteMinimalInfo[];
};

const NotesGrid = ({ notes }: notesGridProps) => {
  return (
    <div className="grow">
      <div
        className="xs:grid-cols-2 grid
        grid-cols-2 gap-2 
        pb-4 
        sm:grid-cols-3 
        md:grid-cols-3 md:gap-3 
        lg:grid-cols-3 
        xl:grid-cols-3
        2xl:grid-cols-4"
      >
        {notes.map((note) => (
          <div
            //sm:h-72 md:h-96 h-60
            className="bg-neutral h-[11rem] p-2 shadow-xl
            md:h-[13rem]
            "
            key={note.id}
          >
            <p
              //overflow-hidden  text-ellipsis
              className=" line-clamp-[8]
            break-words text-sm md:text-base
            "
              style={{ whiteSpace: "pre-wrap" }}
            >
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesGrid;
