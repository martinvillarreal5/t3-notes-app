import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import {
  api,
  //type RouterOutputs
} from "~/utils/api";
import FoldersGrid from "~/components/folders/foldersGrid";
import NotesGrid from "~/components/notes/notesGrid";
import { useState } from "react";
import CreateFolderModal from "~/components/folders/createFolderModal";
import CreateNoteModal from "~/components/notes/createNoteModal";

import {
  FolderPlus as FolderPlusIcon,
  Home as HomeIcon,
  FilePlus as FilePlusIcon,
} from "lucide-react";

//type Folder = RouterOutputs["folder"]["getAll"][0]; // Folder Type

const Folders: NextPage = () => {
  const { data: sessionData } = useSession();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  //TODO Redirect to homepage if not logged or to guest folders page

  const {
    data: folders,
    isLoading: isLoadingFolders,
    isSuccess: isSuccessFolders,
    refetch: refetchFolders,
  } = api.folder.getAllTopLevel.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const {
    data: notes,
    isLoading: isLoadingNotes,
    isSuccess: isSuccessNotes,
    refetch: refetchNotes,
  } = api.note.getAllTopLevel.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

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
      //? https://github.com/prisma/prisma/issues/3197
      //? A workaround may be to use a dummy value instead of null like "isNull", but that will probably lead to more problems.
      console.log("Repeated folder title");
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
          <HomeIcon />
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
        {isLoadingFolders && <p className="py-4 text-2xl ">Loading Folders</p>}
        {!isSuccessFolders && (
          <p className="py-4 text-2xl ">An error ocurred fetching Folders</p>
        )}
        {isSuccessFolders && folders.length > 0 ? (
          <FoldersGrid folders={folders} />
        ) : (
          <p className=" text-sm">You dont have any folder yet.</p>
        )}
        <div className="divider my-1 sm:my-2"></div>

        {isLoadingNotes && <p className="py-4 text-2xl ">Loading Notes</p>}
        {isSuccessNotes && notes.length > 0 ? (
          <NotesGrid notes={notes} />
        ) : (
          <p className="pb-1 text-sm">You dont have any note yet.</p>
        )}
      </Layout>
    </>
  );
};

export default Folders;
