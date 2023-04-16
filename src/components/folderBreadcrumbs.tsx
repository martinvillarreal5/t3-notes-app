import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { ChevronRight as ChevronRightIcon } from "lucide-react";

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
      <div className="flex flex-row flex-wrap items-center gap-2">
        {status === "success" && (
          <>
            <Link href="/folders" className="text-lg">
              Folders
            </Link>
            {folder.ancestors.map((ancestor) => {
              return (
                <div
                  key={ancestor.id}
                  className="flex flex-row items-center gap-2"
                >
                  <ChevronRightIcon size={16} />
                  <Link href={`/folders/${ancestor.id}`} className="text-lg">
                    {ancestor.title}
                  </Link>
                </div>
              );
            })}
            <div key={folder.id} className="flex flex-row items-center gap-2">
              <ChevronRightIcon size={16} />
              <p className="text-lg underline underline-offset-4	">
                {folder.title}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FolderBreadcrumbs;
