import Button from "@components/buttons/button";
import { FaFolderPlus } from "react-icons/fa";
import Popover from "./popover";
import CreateCollectionCard from "@components/cards/create-collection-card";
import { getParentIdFromPath } from "@lib/utils/get-paths";

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
  const pathId = getParentIdFromPath();
  return (
    <Button Icon={FaFolderPlus} iconSize="lg" disabled={pathId === undefined}>
      Collection
    </Button>
  );
}
