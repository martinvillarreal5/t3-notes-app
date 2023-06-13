import { useRouter } from "next/router";
import Layout from "~/components/layout/layout";
import CreateNoteForm from "~/components/notes/createNoteForm";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import FolderBreadcrumbs from "~/components/folders/folderBreadcrumbs";
import { useEffect } from "react";

const NewNote = () => {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      console.log(sessionStatus);
      void router.push("/signin");
    }
  }, [router, sessionStatus]);
  const { folderId } = router.query as { folderId: string };
  const { data: folder, status } = api.folder.getById.useQuery(
    { folderId: folderId },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <>
      <Layout extraNavbarContent={<FolderBreadcrumbs folderId={folderId} />}>
        {status === "loading" && "Loading"}
        {status === "success" && (
          <>
            <h2 className="mb-3 text-2xl">Create Note</h2>
            <CreateNoteForm folderId={folderId} />
          </>
        )}
      </Layout>
    </>
  );
};

export default NewNote;
