import Button from "@components/buttons/button";
import { FaFolderPlus } from "react-icons/fa";
import Popover from "./popover";
import CreateCollectionCard from "@components/cards/create-collection-card";
import { useParentIdFromPath } from "@lib/utils/get-paths";

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
  const pathId = useParentIdFromPath();
  return (
    <Button
      Icon={FaFolderPlus}
      iconSize="lg"
      disabled={pathId === undefined}
      className="text-xs md:text-sm px-2.5 md:px-6 py-1.5 md:py-2"
    >
      Collection
    </Button>
  );
}
