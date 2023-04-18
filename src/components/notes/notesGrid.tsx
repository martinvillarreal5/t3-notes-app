import type { Note } from "@prisma/client";
import Link from "next/link";

type notesGridProps = {
  notes: Note[];
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
          <Link
            //sm:h-72 md:h-96 h-60
            className="bg-neutral pointer-events-auto h-[11rem] p-2
            shadow-xl md:h-[13rem]
            "
            href={`/notes/${note.id}`}
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NotesGrid;
