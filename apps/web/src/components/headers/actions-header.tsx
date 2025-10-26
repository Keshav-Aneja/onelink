import CreateCollection from "@components/popover/create-collection";
import CreateLink from "@components/popover/create-link";
import { useAppSelector } from "@store/store";
import { getClipboardLinkState } from "@store/slices/application-slice";
import { ImSpinner2 } from "react-icons/im";

const ActionHeader = () => {
  const { isAdding, urlCount } = useAppSelector(getClipboardLinkState);

  return (
    <div className="w-full h-8 md:h-12 flex justify-end items-center gap-2 md:gap-4 p-1 md:p-2 xxl:p-3 mb-1 md:mb-3 mt-2 md:mt-0 pr-3">
      {isAdding && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-theme_secondary_white/70">
          <ImSpinner2 className="animate-spin" />
          <span>
            Adding {urlCount} {urlCount === 1 ? "link" : "links"} from clipboard...
          </span>
        </div>
      )}
      <CreateCollection />
      <CreateLink />
    </div>
  );
};

export default ActionHeader;
