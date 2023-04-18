/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { api } from "~/utils/api";

import {
  type NodeRendererProps,
  type NodeApi,
  //type RowRendererProps,
  Tree,
} from "react-arborist";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Data = { id: string; name: string; children?: Data[] };

const FolderArrowButton = ({ node }: { node: NodeApi<Data> }) => {
  const { data } = node;
  if (data.children && data.children.length > 0) {
    if (node.isOpen) {
      return (
        <button
          title="close folder"
          className="btn btn-xs btn-circle btn-ghost"
          onClick={() => node.isInternal && node.toggle()}
        >
          <ChevronDownIcon />
        </button>
      );
    }
    return (
      <button
        title="open folder"
        className="btn btn-xs btn-circle btn-ghost"
        onClick={() => node.isInternal && node.toggle()}
      >
        <ChevronRightIcon />
      </button>
    );
  }
  return <div className="invisible block h-6 w-6" />;
};

const Node = ({ node, style }: NodeRendererProps<any>) => {
  const { state, data } = node;
  console.log(`${node.data.title}, depth:${node.rowIndex}`);
  return (
    <>
      <div
        style={style}
        className="flex h-full flex-row flex-nowrap items-center gap-1 truncate "
      >
        <FolderArrowButton node={node} />
        <div className="h-6 w-6">
          {state.isOpen && data.children[0] ? (
            <FolderOpenIcon size={24} />
          ) : (
            <FolderIcon size={24} />
          )}
        </div>

        <Link href={`/folders/${data.id}`} className="truncate text-xl">
          {data.title}
        </Link>
      </div>
    </>
  );
};

/* const Row = ({ node, attrs, children }: RowRendererProps<any>) => {
  const nodeDepth = attrs["aria-level"];
  return (
    <div
      {...attrs}
      onFocus={(e) => e.stopPropagation()}
      onClick={node.handleClick}
    >
      {children}
    </div>
  );
}; */

const FolderTree = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  //const { folderId } = router.query as { folderId: string | undefined }; //TODO Find a better way?
  const { data: folderFamilyTree, status } = api.folder.getFoldersTree.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <>
      {status === "loading" && <p className="text-xl">Loading</p>}
      {status === "success" && (
        <Tree
          data={folderFamilyTree}
          rowHeight={34}
          width={248}
          disableMultiSelection
          /* selection={folderId}
          selectionFollowsFocus */
        >
          {Node}
        </Tree>
      )}
    </>
  );
};

export default FolderTree;
