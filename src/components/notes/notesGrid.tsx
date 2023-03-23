import { type Note } from "@prisma/client";
import Link from "next/link";

type notesGridProps = {
  notes: Note[];
};

const NotesGrid = ({ notes }: notesGridProps) => {
  return (
    <div className="grow">
      <div
        className="grid grid-cols-2
        gap-2 
        xs:grid-cols-2 
        sm:grid-cols-3 md:grid-cols-3
        md:gap-4 
        lg:grid-cols-4 
        xl:grid-cols-5
        2xl:grid-cols-6"
      >
        {notes.map((note) => (
          <div
            //sm:h-72 md:h-96 h-60
            className="h-[11rem] bg-neutral p-2 shadow-xl
            md:h-[13rem]
            "
            key={note.id}
          >
            <p
              //overflow-hidden  text-ellipsis
              className=" break-words
            text-sm line-clamp-[8] md:text-base
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
