import { Trash2 as TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Modal, ModalPanel, ModalTitle, ModalDescription } from "../ui/modal";
import { useState } from "react";

type DeleteFolderButton = {
  folderId: string;
  folderTitle: string;
  parentFolderId?: string | null;
  disabled?: boolean;
};

const DeleteFolderButton = ({
  folderId,
  parentFolderId = null,
  folderTitle,
  disabled = false,
}: DeleteFolderButton) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const ctx = api.useContext();
  const deleteFolder = api.folder.delete.useMutation({
    onSuccess: () => {
      void ctx.folder.getFoldersTree.invalidate();
      if (parentFolderId) {
        void ctx.folder.getById.invalidate({ folderId: parentFolderId });
        void router.push(`/folders/${parentFolderId}`);
        //void router.back();
      } else {
        void ctx.folder.getRootFolders.invalidate();
        void router.push(`/folders`);
        //void router.back();
      }
    },
  });
  return (
    <>
      <button
        title="Delete this Folder"
        className="btn-square btn-sm btn"
        onClick={() => setIsOpen(true)}
        disabled={disabled || deleteFolder.isLoading || deleteFolder.isSuccess}
        //TODO open confirmation modal
      >
        <TrashIcon />
      </button>
      <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
        <ModalPanel>
          <ModalTitle className={"pb-1 text-xl"}>
            Delete {folderTitle}?
          </ModalTitle>
          <ModalDescription className={"pb-4 text-base"}>
            This will permantly remove {folderTitle} from your folders
          </ModalDescription>
          <div className="flex flex-row justify-between">
            <button
              className="btn btn-error"
              onClick={() =>
                deleteFolder.mutate({
                  id: folderId,
                })
              }
              disabled={deleteFolder.isLoading || deleteFolder.isSuccess}
            >
              Delete
            </button>
            <button
              className="btn "
              onClick={() => setIsOpen(false)}
              disabled={deleteFolder.isLoading || deleteFolder.isSuccess}
            >
              Cancel
            </button>
          </div>
        </ModalPanel>
      </Modal>
    </>
  );
};

export default DeleteFolderButton;
