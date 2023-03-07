import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import {
  api,
  //type RouterOutputs
} from "~/utils/api";
import FoldersGrid from "~/components/folders/foldersGrid";
import CreateFolderButton from "~/components/folders/createFolderButton";

//type Folder = RouterOutputs["folder"]["getAll"][0]; // Folder Type //TODO find other ways to get type

const Folders: NextPage = () => {
  const { data: sessionData } = useSession();
  const {
    data: folders,
    isLoading: isLoadingFolders,
    refetch: refetchFolders,
  } = api.folder.getAllTopLevel.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const createFolder = api.folder.create.useMutation({
    onSuccess: () => {
      void refetchFolders();
    },
  });

  const createFolderHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createFolder.mutate({
        title: e.currentTarget.value,
      });
      e.currentTarget.value = "";
    }
  };

  return (
    <Layout>
      <Head>
        <title>T3 Notes App</title>
      </Head>
      <div className="flex flex-row gap-2 pb-3">
        <h2 className="bold text-3xl font-bold">Folders</h2>
        {sessionData?.user !== undefined && (
          <>
            <CreateFolderButton
              className="btn-ghost btn-sm"
              createFunction={createFolderHandler}
            />
          </>
        )}
      </div>

      {isLoadingFolders && <p className="py-4 text-2xl ">Fetching Folders</p>}
      {folders && folders.length > 0 ? (
        <FoldersGrid folders={folders} />
      ) : (
        <p className="pb-1 text-sm">You dont have any folder yet.</p>
      )}
    </Layout>
  );
};

export default Folders;
