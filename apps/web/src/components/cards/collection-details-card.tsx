import {
  getSelectedCollection,
  setSelectedCollection,
} from "@store/slices/application-slice";
import { useAppDispatch, useAppSelector } from "@store/store";
import { BiSolidFolder } from "react-icons/bi";

const CollectionsDetailCard = () => {
  const collection = useAppSelector(getSelectedCollection);
  const dispatch = useAppDispatch();

  const handleOutsideClick = () => {
    dispatch(setSelectedCollection(null));
  };
  if (!collection) return null;

  return (
    <>
      <div
        className="w-full min-h-screen fixed top-0 left-0"
        onClick={handleOutsideClick}
      ></div>
      <div className="fixed w-1/4 top-1/2 -translate-y-1/2 right-0 h-full bottom-0 bg-[rgba(0,0,0,0.2)] p-3 backdrop-blur-2xl rounded-lg border-1 border-theme_secondary_white/40 flex flex-col gap-2">
        <div className="w-full flex flex-col gap-2 overflow-y-auto h-full">
          <BiSolidFolder className="text-7xl xxl:text-8xl text-theme_secondary_white" />
          <h1 className="text-2xl font-medium text-white -mt-2">
            {collection.name}
          </h1>
          <p className="text-sm text-theme_secondary_white">
            {collection.description}
          </p>
        </div>
      </div>
    </>
  );
};

export default CollectionsDetailCard;
