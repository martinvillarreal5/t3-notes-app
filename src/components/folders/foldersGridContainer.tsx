import FoldersGrid from "./foldersGrid";

type FolderMinimalInfo = {
  id: string;
  title: string;
};
const FoldersGridContainer = ({
  folders,
  dataStatus,
}: {
  folders?: FolderMinimalInfo[];
  dataStatus: string;
}) => {
  return (
    <>
      {dataStatus === "loading" && (
        <p className="py-4 text-2xl ">Loading Folders</p>
      )}
      {dataStatus === "error" && (
        <p className="py-4 text-2xl text-error">
          An error ocurred fetching your folders
        </p>
      )}
      {dataStatus === "success" &&
        (folders && folders.length > 0 ? (
          <FoldersGrid folders={folders} />
        ) : (
          <p className=" text-sm">You dont have any folder yet.</p>
        ))}
    </>
  );
};

export default FoldersGridContainer;
