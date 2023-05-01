import FoldersGrid from "./foldersGrid";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const RootFoldersGridContainer = () => {
  const { data: sessionData } = useSession();
  const { data: folders, status: status } = api.folder.getRootFolders.useQuery(
    undefined,
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
      {status === "success" && folders.length > 0 && (
        <FoldersGrid folders={folders} />
      )}
    </>
  );
};
export default RootFoldersGridContainer;
