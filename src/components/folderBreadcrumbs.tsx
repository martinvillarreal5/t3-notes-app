import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import {
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

const FolderBreadcrumbs = ({ folderId }: { folderId: string }) => {
  const { data: sessionData } = useSession();

  const { data: folder, status } = api.folder.getById.useQuery(
    { folderId: folderId },
    {
      enabled: sessionData?.user !== undefined && !!folderId,
    }
  );

  if (status === "loading") {
    return <p className="pl-2 text-lg">Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-row items-center">
        {status === "success" && (
          <>
            <HomeIcon />
            <Link href="/folders" className="pl-2 text-lg">
              Folders
            </Link>
            {folder.ancestors.map((ancestor) => {
              return (
                <div key={ancestor.id} className="flex flex-row items-center">
                  <ChevronRightIcon className="pl-2" />
                  <Link
                    href={`/folders/${ancestor.id}`}
                    className="pl-2 text-lg"
                  >
                    {ancestor.title}
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default FolderBreadcrumbs;
