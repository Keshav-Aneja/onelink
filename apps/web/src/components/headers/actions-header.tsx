import CreateCollection from "@components/popover/create-collection";
import CreateLink from "@components/popover/create-link";
const ActionHeader = () => {
  return (
    <div className="w-full h-8 md:h-12 flex justify-end items-center gap-2 md:gap-4 p-1 md:p-2 xxl:p-3 mb-1 md:mb-3 pr-3">
      <CreateCollection />
      <CreateLink />
    </div>
  );
};

export default ActionHeader;
