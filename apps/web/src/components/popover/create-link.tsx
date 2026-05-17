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
      variant="primary"
      disabled={pathId === undefined}
    >
      Link
    </Button>
  );
}
