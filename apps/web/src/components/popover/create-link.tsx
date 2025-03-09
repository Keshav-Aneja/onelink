import Button from "@components/buttons/button";
import Popover from "./popover";
import { MdAddLink } from "react-icons/md";
import CreateLinkCard from "@components/cards/create-link-card";
import { getParentIdFromPath } from "@lib/utils/get-paths";

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
  const pathId = getParentIdFromPath();
  return (
    <Button Icon={MdAddLink} iconSize="lg" disabled={pathId === undefined}>
      Link
    </Button>
  );
}
