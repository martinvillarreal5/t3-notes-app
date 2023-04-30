import { type Note } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { Save as SaveIcon } from "lucide-react";
import { api } from "~/utils/api";
import DeleteNoteButton from "~/components/notes/deleteNoteButton";

const noteFormSchema = z.object({
  title: z
    .string()
    .max(30, { message: "Note title must be 30 characters long or less." })
    .optional(),
  content: z
    .string()
    .min(1, { message: "Note content is required." })
    .max(65535, {
      message: "Note content must be 65,535 characters long or less.",
    })
    .optional(),
});

type FormData = z.infer<typeof noteFormSchema>;

type UpdateNoteFormProps = {
  note: Note;
};

const UpdateNoteForm = ({ note }: UpdateNoteFormProps) => {
  const defaultValues = {
    title: note.title || "",
    content: note.content,
  };
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isValid, dirtyFields, isDirty },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(noteFormSchema),
    defaultValues: defaultValues,
  });
  const [isServerError, setIsServerError] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const ctx = api.useContext();

  const updateNote = api.note.update.useMutation({
    onMutate: () => {
      void setIsMutating(true);
    },
    onError: () => {
      void setIsServerError(true); //TODO Trow Toast
      void resetForm();
    },
    onSettled: () => {
      void setIsMutating(false);
      void ctx.note.getById.invalidate({ noteId: note.id });
      console.log("settled");
    },
  });
  const onSubmit = (data: FormData) => {
    if (isDirty) {
      type UpdateData = FormData & { noteId: string };
      const updateData: UpdateData = {
        noteId: note.id,
      };

      const dirtyFieldsArray = Object.keys(dirtyFields);
      dirtyFieldsArray.forEach((key) => {
        updateData[key as keyof FormData] = data[key as keyof FormData];
      });
      updateNote.mutate({ ...updateData });
      resetForm({ ...data });
    } else console.log("No fields where modified"); //TODO show toast
    resetForm(undefined, {
      keepValues: true,
    });
  };

  return (
    <>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-3">
          {/* <button title="More" className="btn-square btn-sm btn">
            <MenuIcon />
          </button> */}
          <DeleteNoteButton
            noteId={note.id}
            folderId={note.folderId}
            noteTitle={note.title}
            disabled={isMutating}
          />
          <button
            title="Save Changes"
            type="submit"
            className="btn-square btn-sm btn btn-success"
            disabled={isMutating || !isDirty || !isValid}
          >
            <SaveIcon />
          </button>
          <input
            type="text"
            placeholder="Note Title"
            className="bg-base-300 w-full resize-none text-2xl outline-none sm:text-3xl"
            autoComplete="off"
            spellCheck="false"
            disabled={isMutating}
            {...register("title")}
          />
        </div>
        {errors.title && (
          <p className="text-error mt-2">{errors.title.message}</p>
        )}
        <TextareaAutosize
          autoFocus
          autoComplete="off"
          spellCheck="false"
          placeholder="Note Content"
          minRows={1}
          className="bg-base-300 mt-3 w-full resize-none
          overflow-y-hidden text-base outline-none sm:text-xl"
          disabled={isMutating}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-error ">{errors.content.message}</p>
        )}
      </form>
    </>
  );
};

export default UpdateNoteForm;
