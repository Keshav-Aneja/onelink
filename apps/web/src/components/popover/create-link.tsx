import Button from "@components/buttons/button";
import Popover from "./popover";
import { MdAddLink } from "react-icons/md";
import CreateLinkCard from "@components/cards/create-link-card";
import { useParentIdFromPath } from "@lib/utils/get-paths";

const CreateLink = () => {
  return (
    <Popover
      Trigger={<LinkTrigger />}
      Content={({ className, closeModal }) => (
        <CreateLinkCard className={className} closeModal={closeModal} />
      )}
      modal={true}
    />
  );
};

export default CreateLink;

export function LinkTrigger() {
  const pathId = useParentIdFromPath();
  return (
    <Button
      Icon={MdAddLink}
      iconSize="lg"
      disabled={pathId === undefined}
      className="text-xs md:text-sm px-2.5 md:px-6 py-1.5 md:py-2"
    >
      Link
    </Button>
  );
}
