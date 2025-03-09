import Button from "@components/buttons/button";
import Popover from "./popover";
import { MdAddLink } from "react-icons/md";
import CreateLinkCard from "@components/cards/create-link-card";

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
  return (
    <Button Icon={MdAddLink} iconSize="lg">
      Link
    </Button>
  );
}
