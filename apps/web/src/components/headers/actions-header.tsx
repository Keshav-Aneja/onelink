import CreateCollection from "@components/popover/create-collection";
import CreateLink from "@components/popover/create-link";
const ActionHeader = () => {
  return (
    <div className="w-full h-12 flex justify-end items-center gap-4 p-2 xxl:p-3">
      <CreateCollection />
      <CreateLink />
    </div>
  );
};

export default ActionHeader;
