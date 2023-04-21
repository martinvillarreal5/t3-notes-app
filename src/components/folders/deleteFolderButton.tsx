import { Trash2 as TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

type DeleteFolderButton = {
  folderId: string;
  parentFolderId?: string | null;
};

const DeleteFolderButton = ({
  folderId,
  parentFolderId = null,
}: DeleteFolderButton) => {
  const router = useRouter();
  const ctx = api.useContext();
  const deleteFolder = api.folder.delete.useMutation({
    onSuccess: () => {
      void ctx.folder.getFoldersTree.invalidate();
      if (parentFolderId) {
        void ctx.folder.getById.invalidate({ folderId: parentFolderId });
        //void router.push(`/folders/${parentFolderId}`);
        void router.back();
      } else {
        void ctx.folder.getRootFolders.invalidate();

        //void router.push(`/folders/`);
        void router.back();
      }
    },
  });
  const deleteFolderHandler = (deleteId: string) => {
    deleteFolder.mutate({
      id: deleteId,
    });
  };
  return (
    <button
      title="Delete this Folder"
      className="btn-square btn-sm btn"
      onClick={() => deleteFolderHandler(folderId)}
      disabled={deleteFolder.isLoading}
      //TODO open confirmation modal
    >
      <TrashIcon />
    </button>
  );
};

export default DeleteFolderButton;
