import getPaths, { getPath } from "@lib/utils/get-paths";
import { IoFolderOpen } from "react-icons/io5";
import { Link } from "react-router";

const Breadcrumbs = () => {
  const paths = getPaths();
  return (
    <div className="w-full px-3 flex items-center gap-2">
      {paths.length > 6
        ? paths.slice(-6).map((path, _i) => <Crumb label={path} key={_i} />)
        : paths.map((path, _i) => <Crumb label={path} key={_i} />)}
    </div>
  );
};

export default Breadcrumbs;

interface CrumbProps {
  label: string;
}
export const Crumb = ({ label }: CrumbProps) => {
  return (
    <Link to={getPath(label)} className="flex items-center gap-1 text-lg group">
      <IoFolderOpen className=" group-first:block hidden group-hover:text-primary group-last:text-primary" />
      <span className="group-last:underline group-last:text-primary group-last:font-medium px-4  group-hover:text-primary group-hover:underline underline-offset-4 cursor-pointer">
        {label}
      </span>
      <span className="group-last:hidden">/</span>
    </Link>
  );
};
