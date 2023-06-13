import { type Note } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const createNoteSchema = z.object({
  title: z
    .string()
    .max(30, { message: "Note title must be 30 characters long or less." })
    .optional(),
  content: z
    .string()
    .min(1, { message: "Note content is required." })
    .max(65535, {
      message: "Note content must be 65,535 characters long or less.",
    }),
});

type FormData = z.infer<typeof createNoteSchema>;

type CreateNoteFormProps = {
  folderId: string;
};

const CreateNoteForm = ({ folderId }: CreateNoteFormProps) => {
  const defaultValues = {
    title: "",
    content: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(createNoteSchema),
    defaultValues: defaultValues,
  });
  const [isServerError, setIsServerError] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const ctx = api.useContext();
  const router = useRouter();
  const createNote = api.note.create.useMutation({
    onMutate: () => {
      void setIsMutating(true);
    },
    onError: () => {
      void setIsMutating(false);
      setIsServerError(true); //TODO throw toast
    },
    /* onSettled: () => {
      void setIsMutating(false);
    }, */
    onSuccess: () => {
      //void reset();
      folderId
        ? void ctx.folder.getById.invalidate({ folderId: folderId })
        : void ctx.note.getRootNotes.invalidate();
      void router.push(`/folders/${folderId}`);
    },
  });

  const onSubmit = (data: FormData) => {
    createNote.mutate({
      folderId: folderId,
      content: data.content,
      title: data.title || undefined,
    });
  };

  return (
    <>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Note Title"
          className="input mb-3 w-full 
          text-base sm:text-xl"
          autoComplete="off"
          spellCheck="false"
          disabled={isMutating}
          {...register("title")}
        />
        {errors.title && (
          <p className="mb-3 text-error">{errors.title.message}</p>
        )}
        <TextareaAutosize
          autoFocus
          autoComplete="off"
          spellCheck="false"
          placeholder="Note Content"
          minRows={1}
          className="textarea mb-3 w-full resize-none
          text-base sm:text-xl"
          disabled={isMutating}
          {...register("content")}
        />
        {errors.content && (
          <p className="mb-2 text-error">{errors.content.message}</p>
        )}
        <button className="btn-success btn-md btn">Create</button>
      </form>
    </>
  );
};

export default CreateNoteForm;
