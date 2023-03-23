import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import DeleteButton from "~/components/buttons/deleteButton";
import FoldersGrid from "~/components/folders/foldersGrid";
import { useState } from "react";
import CreateFolderIcon from "~/components/Icons/createFolderIcon";
import CreateFolderModal from "~/components/folders/createFolderModal";
import CreateNoteIcon from "~/components/Icons/createNoteIcon";
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
    isLoading,
    refetch,
  } = api.folder.getByIdWithSubfolders.useQuery(
    { folderId: folderId },
    { enabled: sessionData?.user !== undefined }
  );

  const {
    data: notes,
    isLoading: isLoadingNotes,
    refetch: refetchNotes,
  } = api.note.getByFolderId.useQuery(
    { folderId: folderId },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const parentFolderId = folder?.parentFolderId;

  const createSubFolder = api.folder.create.useMutation({
    onSuccess: () => {
      void setIsFolderModalOpen(false);
      void refetch();
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
    <Layout>
      <Head>
        <title>T3 Notes App</title>
      </Head>

      <div className="flex flex-row items-end gap-2 pb-3	">
        <h2 className=" text-2xl sm:text-3xl">
          {folder?.title || "Loading?.."}
        </h2>
        {folder && (
          <>
            <button
              className="btn-ghost btn-square btn-sm btn"
              title="Create Folder"
              onClick={() => setIsFolderModalOpen(true)}
            >
              <CreateFolderIcon />
            </button>
            <CreateFolderModal
              isOpen={isFolderModalOpen}
              setIsOpen={setIsFolderModalOpen}
              createFunction={createSubFolderHandler}
            />
            <button
              title="Create Note"
              className="btn-ghost btn-square btn-sm btn"
              onClick={() => setIsNoteModalOpen(true)}
            >
              <CreateNoteIcon />
            </button>
            <CreateNoteModal
              isOpen={isNoteModalOpen}
              setIsOpen={setIsNoteModalOpen}
              createFunction={createNoteHandler}
            />
            <DeleteButton
              className="btn-ghost btn-square btn-sm btn"
              deleteFunction={deleteFolderHandler}
              idToDelete={folder.id}
            />
          </>
        )}
      </div>
      {folder?.subFolders && folder.subFolders.length > 0 && (
        <FoldersGrid folders={folder.subFolders} />
      )}
      <div className="divider my-1 sm:my-2"></div>
      {isLoadingNotes && <p className="py-4 text-2xl ">Loading Notes</p>}
      {notes && notes.length > 0 ? (
        <NotesGrid notes={notes} />
      ) : (
        <p className="grow pb-1 text-sm">You dont have any note yet.</p>
      )}
      {folder?.parentFolderId && (
        <p className="py-2 text-xl underline">
          <Link href={`/folders/${folder.parentFolderId}`}>
            {`← Back to parent folder`}{" "}
          </Link>
        </p>
      )}
      {/* TODO get parent folder title with an include in the prisma query */}
      <p className="py-2 text-xl underline">
        <Link href="/folders">← Back to folders</Link>
      </p>
    </Layout>
  );
};

export default Folder;
