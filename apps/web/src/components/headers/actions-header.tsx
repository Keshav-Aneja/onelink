import Button from "@components/buttons/button";
import CreateCollection from "@components/popover/create-collection";
import { FaFolderPlus } from "react-icons/fa";
import { MdAddLink } from "react-icons/md";
const ActionHeader = () => {
  return (
    <div className="w-full h-12 flex justify-end items-center gap-4 p-2 xxl:p-3">
      <CreateCollection />
      <Button Icon={MdAddLink} iconSize="xl">
        Link
      </Button>
    </div>
  );
};

export default ActionHeader;
