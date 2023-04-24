import type { Folder } from "@prisma/client";
import type { FolderMinimalInfo } from "~/types/minimalTypes";
import { useState } from "react";
import { api } from "~/utils/api";
import Modal from "../ui/modal";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  parentTitle?: string;
  parentId?: string | null;
  folders?: FolderMinimalInfo[] | Folder[]; //Find a way to make this prop required when parentId is not specified as prop
};

const createFolderFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Folder title is required." })
    .max(30, { message: "Folder title must be 30 characters long or less." }),
});

type FormData = z.infer<typeof createFolderFormSchema>;

const CreateFolderModal = ({
  isOpen,
  setIsOpen,
  parentTitle,
  parentId = null,
  folders,
}: ModalProps) => {
  const [Error, setError] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createFolderFormSchema),
  });
  const ctx = api.useContext();

  const createFolder = api.folder.create.useMutation({
    onMutate: () => {
      void setIsMutating(true);
    },
    onError: (error) => {
      void setError(error.message); //TODO Replace with toast indicating server error?
      void setIsMutating(false);
      console.log("Error creating folder: " + error.message);
    },
    onSuccess: () => {
      void setError("");
      parentId
        ? void ctx.folder.getById.invalidate({ folderId: parentId })
        : void ctx.folder.getRootFolders.invalidate();
      void ctx.folder.getFoldersTree.invalidate();

      void setIsOpen(false);
      void setTimeout(() => {
        resetForm();
        setIsMutating(false);
      }, 200);
    },
  });

  const onSubmit = (data: FormData) => {
    if (!parentId) {
      // If the folder is a root level folder (has no parent)
      if (folders?.some((folder) => folder.title === data.title)) {
        // the unique compound constraint of the prisma model wont work because i doesnt that field
        // with null values as equal. So even if they have the same title, the parentId is null and
        // prisma will take it as diferent values
        // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unique-1
        // https://github.com/prisma/prisma/issues/3197console.log("Repeated folder title");
        setError(
          "Folder title is already used by another folder in this directory"
        );
        return;
      }
    }

    createFolder.mutate({
      title: data.title,
      parentFolderId: parentId,
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create Folder"
      description={
        parentTitle
          ? `Add a new sub-folder in the '${parentTitle}' directory to your account.`
          : `Add a new folder to your account.`
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Folder Title"
          className="input-bordered input input-sm sm:input-md mt-2.5 w-full"
          autoComplete="off"
          disabled={isMutating}
          {...register("title")}
        />
        {Error && <p className="text-error mt-2">{Error}</p>}
        {errors.title && (
          <p className="text-error mt-2">{errors.title.message}</p>
        )}
        <div className="modal-action ">
          <button
            type="submit"
            className="btn-success btn"
            disabled={isMutating}
          >
            Save
          </button>
          <button
            type="button"
            className="btn-error btn"
            onClick={() => setIsOpen(false)}
            disabled={isMutating}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFolderModal;
