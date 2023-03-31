import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { useState } from "react";
import CreateFolderModal from "~/components/folders/createFolderModal";
import CreateNoteModal from "~/components/notes/createNoteModal";

import {
  FolderPlus as FolderPlusIcon,
  //Home as HomeIcon,
  FilePlus as FilePlusIcon,
} from "lucide-react";
import FoldersGridContainer from "~/components/folders/foldersGridContainer";
import NotesGridContainer from "~/components/notes/notesGridContainer";

const Folders: NextPage = () => {
  const { data: sessionData } = useSession();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  //TODO Redirect to homepage if not logged or to guest folders page

  const {
    data: folders,
    refetch: refetchFolders,
    status: foldersStatus,
  } = api.folder.getByParentFolderId.useQuery(
    { parentFolderId: null },
    { enabled: sessionData?.user !== undefined }
  );

  const {
    data: notes,
    refetch: refetchNotes,
    status: notesStatus,
  } = api.note.getByFolderId.useQuery(
    { folderId: null },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const createFolder = api.folder.create.useMutation({
    onSuccess: () => {
      void setIsFolderModalOpen(false);
      void refetchFolders();
    },
    //Check onMutation and onError
  });

  const createFolderHandler = (newFolderTitle: string) => {
    if (folders?.some((folder) => folder.title === newFolderTitle)) {
      //? We cant use a compound unique constraint in the prisma schema like [userId, title, parentId]
      //? because parentId can be null
      //? https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unique-1
      //? https://github.com/prisma/prisma/issues/3197console.log("Repeated folder title");
      //TODO throw error
      return;
    }
    createFolder.mutate({
      title: newFolderTitle,
    });
  };

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void setIsNoteModalOpen(false);
      void refetchNotes();
    },
  });

  const createNoteHandler = (noteContent: string) => {
    createNote.mutate({
      content: noteContent,
    });
  };

  return (
    <>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <Layout>
        <div className="flex flex-row items-center gap-2 pb-3">
          {/* <HomeIcon /> */}
          <h2 className="text-2xl sm:text-3xl">Folders</h2>
          {sessionData?.user !== undefined && (
            <>
              <button
                className="btn-square btn-sm btn"
                title="Create Folder"
                onClick={() => setIsFolderModalOpen(true)}
              >
                <FolderPlusIcon />
              </button>
              <CreateFolderModal
                isOpen={isFolderModalOpen}
                setIsOpen={setIsFolderModalOpen}
                createFunction={createFolderHandler}
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
            </>
          )}
        </div>
        <FoldersGridContainer dataStatus={foldersStatus} folders={folders} />
        <div className="divider my-1 sm:my-2"></div>
        {/*Check if adheres to https://www.w3.org/TR/wai-aria-1.2/#separator*/}
        <NotesGridContainer dataStatus={notesStatus} notes={notes} />
      </Layout>
    </>
  );
};

export default Folders;
