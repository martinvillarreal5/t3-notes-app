/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Minus as MinusIcon,
} from "lucide-react";
import { api } from "~/utils/api";

import {
  type NodeRendererProps,
  type NodeApi,
  //type RowRendererProps,
  Tree,
} from "react-arborist";
import Link from "next/link";

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
  return (
    <>
      <div style={style} className="flex h-full flex-row items-center  gap-1">
        <FolderArrowButton node={node} />
        <Link
          href={`/folders/${data.id}`}
          className="flex h-full flex-row items-center gap-1"
        >
          {state.isOpen && data.children[0] ? (
            <FolderOpenIcon />
          ) : (
            <FolderIcon />
          )}
          <p className="truncate text-xl">{data.title}</p>
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
  const { data: folderFamilyTree, status } =
    api.folder.getFoldersTree.useQuery();

  return (
    <>
      {status === "loading" && <p className="text-xl">Loading</p>}
      {status === "success" && (
        <Tree initialData={folderFamilyTree} rowHeight={34} width={248}>
          {Node}
        </Tree>
      )}
    </>
  );
};

export default FolderTree;
