import FoldersGrid from "./foldersGrid";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SubFoldersGridContainer = () => {
  const router = useRouter();
  const { folderId } = router.query as { folderId: string }; //TODO Find a better way?
  const { data: sessionData } = useSession();
  const { data: folder, status } = api.folder.getById.useQuery(
    { folderId: folderId },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <>
      {status === "loading" && (
        <p className="mt-2 h-10 text-sm sm:h-12 lg:h-14">Loading Folders</p>
      )}
      {status === "error" && (
        <p className="text-error mt-2 h-10 text-sm sm:h-12 lg:h-14">
          An error ocurred fetching your folders
        </p>
      )}
      {status === "success" && folder.subFolders.length > 0 && (
        <FoldersGrid folders={folder.subFolders} />
      )}
    </>
  );
};
export default SubFoldersGridContainer;
