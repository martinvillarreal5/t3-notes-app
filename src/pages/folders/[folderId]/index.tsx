import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import {
  FolderPlus as FolderPlusIcon,
  FilePlus as FilePlusIcon,
} from "lucide-react";
import Layout from "~/components/layout/layout";
import CreateFolderModal from "~/components/folders/createFolderModal";
import CreateNoteModal from "~/components/notes/createNoteModal";
import FoldersGridContainer from "~/components/folders/foldersGridContainer";
import NotesGridContainer from "~/components/notes/notesGridContainer";
import FolderBreadcrumbs from "~/components/folders/folderBreadcrumbs";
import DeleteFolderButton from "~/components/folders/deleteFolderButton";

const Folder: NextPage = () => {
  const router = useRouter();
  const { folderId } = router.query as { folderId: string }; //TODO Find a better way?
  const { data: sessionData, status: sessionStatus } = useSession();

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      console.log(sessionStatus);
      void router.push("/signin");
    }
  }, [router, sessionStatus]);

  const { data: folder, status } = api.folder.getById.useQuery(
    { folderId: folderId },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <>
      <Head>
        {status === "loading" && <title>Loading...</title>}
        {status === "error" && <title>An Error Ocurred</title>}
        {status === "success" && <title>{folder.title}</title>}
      </Head>
      <Layout extraNavbarContent={<FolderBreadcrumbs folderId={folderId} />}>
        <div className="flex flex-row items-end gap-2 pb-3	">
          <h2 className=" text-2xl sm:text-3xl">
            {status === "loading" && "Loading.."}
            {status === "error" && (
              <span className="text-error">An Error Ocurred</span>
            )}
            {status === "success" && folder.title}
          </h2>
          {sessionData?.user !== undefined && status === "success" && (
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
                parentId={folder.id}
                parentTitle={folder.title}
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
                folderId={folder.id}
                folderTitle={folder.title}
              />
              <DeleteFolderButton
                folderId={folder.id}
                folderTitle={folder.title}
                parentFolderId={folder.parentFolderId}
              />
            </>
          )}
        </div>
        <FoldersGridContainer
          folders={folder?.subFolders}
          dataStatus={status}
        />
        <div className="divider my-1 sm:my-2" />
        <NotesGridContainer notes={folder?.notes} dataStatus={status} />
      </Layout>
    </>
  );
};

export default Folder;
