import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import {
  FolderPlus as FolderPlusIcon,
  FilePlus as FilePlusIcon,
  Trash2 as TrashIcon,
} from "lucide-react";
import FoldersGrid from "~/components/folders/foldersGrid";
import CreateFolderModal from "~/components/folders/createFolderModal";
import CreateNoteModal from "~/components/notes/createNoteModal";
import NotesGrid from "~/components/notes/notesGrid";

const Folder: NextPage = () => {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const router = useRouter();
  const { folderId } = router.query as { folderId: string }; //TODO Find a better way?

  const { data: sessionData } = useSession();

  const {
    data: folder,
    isLoading: isLoadingFolder,
    isSuccess: isSuccessFolder,
    isError: isErrorFolder,
    refetch: refetchFolder,
  } = api.folder.getByIdWithSubfolders.useQuery(
    { folderId: folderId },
    { enabled: sessionData?.user !== undefined }
  );

  const {
    data: notes,
    isLoading: isLoadingNotes,
    isSuccess: isSuccessNotes,
    isError: isErrorNotes,
    refetch: refetchNotes,
  } = api.note.getByFolderId.useQuery(
    { folderId: folderId },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const parentFolderId = folder?.parentFolderId;

  const createSubFolder = api.folder.createSubFolder.useMutation({
    onSuccess: () => {
      void setIsFolderModalOpen(false);
      void refetchFolder();
    },
  });

  const createSubFolderHandler = (subFolderTitle: string) => {
    if (folder?.subFolders?.some((folder) => folder.title === subFolderTitle)) {
      console.log("Repeated subfolder title");
      //TODO throw error
      return;
    }
    createSubFolder.mutate({
      title: subFolderTitle,
      parentFolderId: folderId,
    });
  };

  const createNote = api.note.createFolderNote.useMutation({
    onSuccess: () => {
      void setIsNoteModalOpen(false);
      void refetchNotes();
    },
  });

  const createNoteHandler = (noteContent: string) => {
    createNote.mutate({
      content: noteContent,
      folderId: folderId,
    });
  };

  const deleteFolder = api.folder.delete.useMutation({
    onSuccess: () => {
      parentFolderId
        ? void router.push(`/folders/${parentFolderId}`)
        : void router.push(`/folders/`);
    },
  });

  const deleteFolderHandler = (deleteId: string) => {
    deleteFolder.mutate({
      id: deleteId,
    });
  };

  return (
    <>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <Layout>
        <div className="flex flex-row items-end gap-2 pb-3	">
          <h2 className=" text-2xl sm:text-3xl">
            {isLoadingFolder && "Loading.."}
            {isErrorFolder && (
              <span className="text-error">An Error Ocurred</span>
            )}
            {isSuccessFolder && folder.title}
          </h2>
          {sessionData?.user !== undefined && isSuccessFolder && (
            <>
              <button
                title="Create Folder"
                className="btn-square btn-sm btn"
                onClick={() => setIsFolderModalOpen(true)}
              >
                <FolderPlusIcon />
              </button>
              <CreateFolderModal
                isOpen={isFolderModalOpen}
                setIsOpen={setIsFolderModalOpen}
                createFunction={createSubFolderHandler}
              />
              <button
                title="Create Note"
                className="btn-square btn-sm btn"
                onClick={() => setIsNoteModalOpen(true)}
              >
                <FilePlusIcon />
              </button>
              <CreateNoteModal
                isOpen={isNoteModalOpen}
                setIsOpen={setIsNoteModalOpen}
                createFunction={createNoteHandler}
              />
              <button
                title="Delete Folder"
                className="btn-square btn-sm btn"
                onClick={() => deleteFolderHandler(folder.id)}
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>
        {isLoadingFolder && (
          <p className="py-4 text-2xl ">Loading Sub-Folders</p>
        )}
        {isErrorFolder && (
          <p className="py-4 text-2xl text-error">
            An error ocurred fetching your folders
          </p>
        )}
        {isSuccessFolder &&
          (folder.subFolders.length > 0 ? (
            <FoldersGrid folders={folder.subFolders} />
          ) : (
            <p className="text-sm">You dont have any folder yet.</p>
          ))}
        <div className="divider my-1 sm:my-2"></div>
        {isLoadingNotes && <p className="py-4 text-2xl ">Loading Notes</p>}
        {isErrorNotes && (
          <p className="py-4 text-2xl text-error">
            An error ocurred fetching your notes
          </p>
        )}
        {isSuccessNotes &&
          (notes.length > 0 ? (
            <NotesGrid notes={notes} />
          ) : (
            <p className="grow pb-1 text-sm">You dont have any note yet.</p>
          ))}
        {folder?.parentFolderId && (
          <p className="py-2 text-xl underline">
            <Link href={`/folders/${folder.parentFolderId}`}>
              {`← Back to parent folder`}
            </Link>
          </p>
        )}
        {/* TODO get parent folder title with an include in the prisma query */}
        <p className="py-2 text-xl underline">
          <Link href="/folders">← Back to folders</Link>
        </p>
      </Layout>
    </>
  );
};

export default Folder;
