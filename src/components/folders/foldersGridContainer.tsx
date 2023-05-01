import FoldersGrid from "./foldersGrid";
import type { FolderMinimalInfo } from "~/types/minimalTypes";

const FoldersGridContainer = ({
  folders,
  dataStatus,
}: {
  folders: FolderMinimalInfo[] | undefined;
  dataStatus: string;
}) => {
  return (
    <>
      {dataStatus === "loading" && (
        <p className="mt-2 h-10 text-sm sm:h-12 lg:h-14">Loading Folders</p>
      )}
      {dataStatus === "error" && (
        <p className="text-error mt-2 h-10 text-sm sm:h-12 lg:h-14">
          An error ocurred fetching your folders
        </p>
      )}
      {dataStatus === "success" &&
        (folders && folders.length > 0 ? (
          <FoldersGrid folders={folders} />
        ) : (
          <p className="mt-2 h-10 text-sm sm:h-12 lg:h-14">
            You dont have any folder yet.
          </p>
        ))}
    </>
  );
};

export default FoldersGridContainer;
