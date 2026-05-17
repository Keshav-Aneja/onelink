import { cn } from "@lib/tailwind-utils";
import getPaths, { useParentIdFromPath, usePath } from "@lib/utils/get-paths";
import { IoFolderOpen } from "react-icons/io5";
import { Link } from "react-router";
import { useMemo } from "react";
import CreateCollection from "@components/popover/create-collection";
import CreateLink from "@components/popover/create-link";
import { useAppSelector } from "@store/store";
import { getClipboardLinkState } from "@store/slices/application-slice";
import { ImSpinner2 } from "react-icons/im";

const Breadcrumbs = () => {
  const paths = getPaths();
  const pathId = useParentIdFromPath();
  const { isAdding, urlCount } = useAppSelector(getClipboardLinkState);

  const displayPaths = useMemo(
    () => (paths.length > 6 ? paths.slice(-6) : paths),
    [paths],
  );

  return (
    <div className="w-full px-1 md:px-3 flex items-center gap-1 md:gap-2 mb-1 md:mb-3">
      <div
        className={cn(
          "flex items-center gap-1 md:gap-2 flex-1 min-w-0",
          pathId === undefined && "pointer-events-none opacity-50",
        )}
      >
        {displayPaths.map((path) => (
          <Crumb label={path} key={path} />
        ))}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isAdding && (
          <div className="flex items-center gap-2 text-xs text-theme_secondary_white/70">
            <ImSpinner2 className="animate-spin" />
            <span>
              Adding {urlCount} {urlCount === 1 ? "link" : "links"}…
            </span>
          </div>
        )}
        <div className="flex items-center rounded-md overflow-hidden border border-primary/40">
          <div className="border-r border-primary/40">
            <CreateCollection />
          </div>
          <CreateLink />
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;

interface CrumbProps {
  label: string;
}
export const Crumb = ({ label }: CrumbProps) => {
  const linkPath = usePath(label);

  return (
    <Link
      to={linkPath}
      className="flex items-center gap-1 text-sm md:text-lg group"
    >
      <IoFolderOpen className=" group-first:block hidden group-hover:text-primary group-last:text-primary" />
      <span className="group-last:underline group-last:text-primary group-last:font-medium px-2  group-hover:text-primary group-hover:underline underline-offset-4 cursor-pointer text-xs md:text-sm">
        {label}
      </span>
      <span className="group-last:hidden">/</span>
    </Link>
  );
};
