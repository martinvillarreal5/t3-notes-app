import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout/layout";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import CreateFolderModal from "~/components/folders/createFolderModal";
import CreateNoteModal from "~/components/notes/createNoteModal";

import {
  FolderPlus as FolderPlusIcon,
  FilePlus as FilePlusIcon,
} from "lucide-react";
import NotesGridContainer from "~/components/notes/notesGridContainer";
import { useRouter } from "next/router";
import RootFoldersGridContainer from "~/components/folders/rootFoldersGridContainer";

const Folders: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      console.log(sessionStatus);
      void router.push("/signin");
    }
  }, [router, sessionStatus]);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const { data: folders, status: foldersStatus } =
    api.folder.getRootFolders.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });

  const { data: notes, status: notesStatus } = api.note.getRootNotes.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <Layout>
        <div className="flex flex-row items-center gap-2 pb-3">
          <h2 className="text-2xl sm:text-3xl">Folders</h2>
          {foldersStatus === "success" && (
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
                parentId={null}
                folders={folders}
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
              />
            </>
          )}
        </div>
        <RootFoldersGridContainer />
        <div className="divider my-1 sm:my-2"></div>
        {/*Check if adheres to https://www.w3.org/TR/wai-aria-1.2/#separator*/}
        <NotesGridContainer dataStatus={notesStatus} notes={notes} />
      </Layout>
    </>
  );
};

export default Folders;
