import Button from "@components/buttons/button";
import { useCollectionsStats } from "@features/collections/get-collections-stats";
import { cn } from "@lib/tailwind-utils";
import {
  getSelectedCollection,
  setSelectedCollection,
} from "@store/slices/application-slice";
import { useAppDispatch, useAppSelector } from "@store/store";
import { useEffect, useState } from "react";
import { BiSolidFolder, BiSolidPencil } from "react-icons/bi";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import { BsFillSave2Fill } from "react-icons/bs";
const CollectionsDetailCard = () => {
  const collection = useAppSelector(getSelectedCollection);
  const dispatch = useAppDispatch();
  const [shouldFetchStats, setShouldFetchStats] = useState(
    !collection ? false : true,
  );
  const stats = useCollectionsStats(collection?.id ?? null, shouldFetchStats);
  useEffect(() => {
    if (collection && collection.id.length > 0) {
      setShouldFetchStats(true);
    }
  }, [collection]);
  const handleOutsideClick = () => {
    dispatch(setSelectedCollection(null));
  };

  const [edit, setEdit] = useState(false);
  const [localCollectionState, setLocalCollectionState] = useState({
    name: collection?.name || "",
    is_protected: collection?.is_protected || false,
    password: "",
  });
  const [changePassword, setChangePassword] = useState(false);
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
          {edit ? (
            <input
              type="text"
              className="border-0 outline-none focus:outline-none focus:border-0 text-2xl font-medium text-white -mt-2 border-b-1 pb-2 border-theme_secondary_white focus:border-b-1"
              defaultValue={collection.name}
              value={localCollectionState.name}
              onChange={(e) => {
                setLocalCollectionState({
                  ...localCollectionState,
                  name: e.target.value,
                });
              }}
            />
          ) : (
            <h1 className="text-2xl font-medium text-white -mt-2 pb-2 border-b-1 border-transparent">
              {localCollectionState.name}
            </h1>
          )}

          <p className="text-sm text-theme_secondary_white">
            {collection.description}
          </p>
          <button
            className={cn(
              " text-white absolute top-2 right-2 rounded-full p-1 xxl:p-1.5 text-xl xxl:text-2xl cursor-pointer bg-primary/80 hover:bg-primary transition-all duration-200 ease-linear  ",
            )}
            onClick={() => {
              setEdit(!edit);
            }}
          >
            {edit ? (
              <span className="flex items-center gap-2 ">
                <BsFillSave2Fill className="pl-2" />
                <p className="text-sm pr-2">Save</p>
              </span>
            ) : (
              <BiSolidPencil className="text-white/60 hover:text-white" />
            )}
          </button>
          <section className="w-full flex gap-4 mb-4">
            <span className="w-full flex items-center px-2 py-4 justify-center gap-4">
              <p
                className={cn(
                  "text-4xl text-primary font-extrabold",
                  stats.isLoading &&
                    "w-8 rounded-md h-8 animate-pulse bg-primary/60",
                )}
              >
                {stats.data?.data.collections}
              </p>
              <h1 className="text-theme_secondary_white/70">Collections</h1>
            </span>
            <div className="h-full w-[1px] bg-theme_secondary_white/40"></div>
            <span className="w-full flex items-center px-2 py- justify-center gap-4">
              <p
                className={cn(
                  "text-4xl text-primary font-extrabold",
                  stats.isLoading &&
                    "w-8 rounded-md h-8 animate-pulse bg-primary/60",
                )}
              >
                {stats.data?.data.links}
              </p>
              <h1 className="text-theme_secondary_white/70">Links</h1>
            </span>
          </section>
          <button
            className={cn(
              "flex items-center gap-4 group  py-1",
              edit &&
                "cursor-pointer hover:bg-theme_secondary_black rounded-md transition-all duration-200 ease-linear",
            )}
            onClick={() => {
              setChangePassword(!changePassword);
            }}
          >
            <div className="p-2 rounded-full bg-theme_secondary_black text-theme_secondary_white w-fit">
              {localCollectionState.is_protected ? (
                <HiLockClosed />
              ) : (
                <HiLockOpen />
              )}
            </div>
            {localCollectionState.is_protected
              ? "Protected by Password"
              : "No Password Protection"}
          </button>
          <section
            className="w-full pl-12 text-theme_secondary_white"
            style={{
              contentVisibility:
                edit && changePassword && !collection.is_protected
                  ? "auto"
                  : "hidden",
            }}
          >
            <h1 className="text-sm">Add Password</h1>
            <input
              type="password"
              className="border-b-1 focus:border-b-1 focus:outline-none w-full"
              value={localCollectionState.password}
              onChange={(e) => {
                setLocalCollectionState({
                  ...localCollectionState,
                  password: e.target.value,
                });
              }}
            />
            <div className="w-full flex gap-2 items-center mt-4">
              <Button
                className="text-sm py-1 w-1/2"
                onClick={() => {
                  setChangePassword(false);
                  setLocalCollectionState({
                    ...localCollectionState,
                    password: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button className="text-sm py-1 w-1/2 bg-primary/60 hover:bg-primary text-white">
                Save
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CollectionsDetailCard;
