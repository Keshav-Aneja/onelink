import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@store/store";
import { getAllCollections } from "@store/slices/collections-slice";
import type { Collection } from "@onelink/entities/models";
import { cn } from "@lib/tailwind-utils";
import { RiArrowRightSLine, RiArrowDownSLine } from "react-icons/ri";
import { BiSolidFolder } from "react-icons/bi";

function buildNamePath(collectionId: string, all: Collection[]): string {
  const segments: string[] = [];
  let current: Collection | undefined = all.find((c) => c.id === collectionId);
  while (current) {
    segments.unshift(current.name);
    current = current.parent_id
      ? all.find((c) => c.id === current!.parent_id)
      : undefined;
  }
  return `/collections/${segments.join("/")}`;
}

type TreeNodeProps = {
  collection: Collection;
  allCollections: Collection[];
  depth: number;
  activePath: string;
};

const TreeNode = ({
  collection,
  allCollections,
  depth,
  activePath,
}: TreeNodeProps) => {
  const navigate = useNavigate();
  const children = allCollections.filter((c) => c.parent_id === collection.id);
  const hasChildren = children.length > 0;
  const namePath = useMemo(
    () => buildNamePath(collection.id, allCollections),
    [collection.id, allCollections],
  );
  const isActive = activePath === namePath;
  const isAncestor = !isActive && activePath.startsWith(namePath + "/");
  const [expanded, setExpanded] = useState(() => isActive || isAncestor);

  useEffect(() => {
    if (isActive || isAncestor) setExpanded(true);
  }, [isActive, isAncestor]);

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-1 rounded-md py-1 text-sm cursor-pointer transition-colors",
          isActive
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white/90 hover:bg-white/5",
        )}
        style={{
          paddingLeft: `${0.5 + depth * 0.75}rem`,
          paddingRight: "0.5rem",
        }}
      >
        <button
          onClick={() => hasChildren && setExpanded((e) => !e)}
          className={cn(
            "shrink-0 text-white/40 transition-colors hover:text-white/70",
            !hasChildren && "invisible",
          )}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <RiArrowDownSLine size={14} />
          ) : (
            <RiArrowRightSLine size={14} />
          )}
        </button>

        <button
          className="flex-1 min-w-0 text-left"
          onClick={() => { navigate(namePath); if (hasChildren) setExpanded(true); }}
        >
          <span className="truncate text-xs leading-5 block">
            {collection.name}
          </span>
        </button>
      </div>

      {expanded && hasChildren && (
        <ul>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              collection={child}
              allCollections={allCollections}
              depth={depth + 1}
              activePath={activePath}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CollectionTreeSidebar = () => {
  const allCollections = useAppSelector(getAllCollections);
  const rootCollections = allCollections.filter((c) => c.parent_id === null);
  const { pathname: activePath } = useLocation();

  return (
    <aside className="flex flex-col h-full w-56 shrink-0 border-l border-white/5 bg-background">
      <div className="flex gap-2 items-center px-3 py-2.5 border-b border-white/5">
        <BiSolidFolder className="text-sm text-theme_secondary_white" />
        <span className="text-xs font-semibold text-white/40  tracking-wider">
          Collections
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-1">
        {rootCollections.length === 0 ? (
          <p className="px-3 text-xs text-white/30 py-2">No collections yet</p>
        ) : (
          <ul>
            {rootCollections.map((col) => (
              <TreeNode
                key={col.id}
                collection={col}
                allCollections={allCollections}
                depth={0}
                activePath={activePath}
              />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default CollectionTreeSidebar;
