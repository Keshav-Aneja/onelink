import Button from "@components/buttons/button";
import { FaFolderPlus } from "react-icons/fa";
import Popover from "./popover";
import CreateCollectionCard from "@components/cards/create-collection-card";

const CreateCollection = () => {
  return (
    <Popover
      Trigger={<CollectionTrigger />}
      Content={({ className, closeModal }) => (
        <CreateCollectionCard className={className} closeModal={closeModal} />
      )}
      modal={true}
    />
  );
};

export default CreateCollection;

export function CollectionTrigger() {
  return (
    <Button Icon={FaFolderPlus} iconSize="lg">
      Collection
    </Button>
  );
}
