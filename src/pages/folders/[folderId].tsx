import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import DeleteButton from "~/components/buttons/deleteButton";
import FoldersGrid from "~/components/folders/foldersGrid";
import CreateFolderButton from "~/components/folders/createFolderButton";

const Folder: NextPage = () => {
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

  const parentFolderId = folder?.parentFolderId;

  const createSubFolder = api.folder.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const createSubFolderHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const title = e.currentTarget.value;
    if (e.key === "Enter") {
      if (folder?.subFolders?.some((folder) => folder.title === title)) {
        console.log("hay titulo repetido");
        //TODO throw error
        return;
      }
      createSubFolder.mutate({
        title: title,
        parentFolderId: folderId,
      });
      e.currentTarget.value = "";
    }
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

      <div className="flex flex-row gap-2 pb-2	">
        <h2 className=" text-3xl font-bold ">
          {folder?.title || "Loading?.."}
        </h2>
        {folder && (
          <>
            <CreateFolderButton
              className="btn-ghost btn-sm"
              createFunction={createSubFolderHandler}
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
        <div>
          <h3 className="pt-2 pb-1 text-xl">Subfolders:</h3>
          <FoldersGrid folders={folder.subFolders} />
        </div>
      )}

      <div className="grow py-4">
        {/*  <h3 className="text-xl">Notes</h3>
        <div></div> */}
      </div>
      {folder?.parentFolderId && (
        <Link href={`/folders/${folder.parentFolderId}`}>
          <p className="py-4 text-xl underline">{`← Back to parent folder`}</p>
          {/* TODO get parentFolder folder title here in a perfomant way */}
        </Link>
      )}
      <Link href="/folders">
        <p className="py-2 text-xl underline">← Back to folders</p>
      </Link>
    </Layout>
  );
};

export default Folder;
