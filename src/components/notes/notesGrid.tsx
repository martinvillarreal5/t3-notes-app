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
          <div className="h-96 border p-2" key={note.id}>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesGrid;
