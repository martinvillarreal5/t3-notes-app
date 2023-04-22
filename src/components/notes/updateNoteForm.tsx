import { type Note } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";

const noteFormSchema = z.object({
  title: z
    .string()
    .max(50, { message: "Note title must be 50 characters long or less." })
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

const UpdateNoteForm = ({ note }: { note: Note }) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note.title ? note.title : undefined,
      content: note.content,
    },
  });
  const onSubmit = (data: FormData) => {
    if (isDirty) {
      type UpdateData = FormData & { noteId: string };
      const updateData: UpdateData = {
        noteId: note.id,
      };
      const dirtyFieldsArray = Object.keys(dirtyFields);
      console.log(dirtyFieldsArray);
      dirtyFieldsArray.forEach((key) => {
        updateData[key as keyof FormData] = data[key as keyof FormData];
      });
      console.log(updateData);
    } else console.log("No fields where modified"); //TODO show toast
    resetForm(undefined, {
      keepValues: true,
    });
  };

  return (
    <>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Add a title"
          className="bg-base-300 w-full resize-none text-xl outline-none sm:text-2xl"
          autoComplete="off"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-error mt-2">{errors.title.message}</p>
        )}
        <TextareaAutosize
          autoFocus
          autoComplete="off"
          spellCheck="false"
          placeholder="Note Content"
          //defaultValue={note.content}
          minRows={4}
          className="bg-base-300 mt-3 w-full resize-none
          overflow-y-hidden text-base outline-none sm:text-xl"
          {...register("content")}
        />
        {errors.content && (
          <p className="text-error mt-2">{errors.content.message}</p>
        )}
        <button type="submit" className="btn btn-success">
          ok
        </button>
      </form>
    </>
  );
};

export default UpdateNoteForm;
