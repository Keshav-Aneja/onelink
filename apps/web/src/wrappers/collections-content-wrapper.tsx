import { ReactNode } from "react";

type CollectionContentWrapperProps = {
  children: ReactNode;
};
const CollectionContentWrapper = ({
  children,
}: CollectionContentWrapperProps) => {
  return (
    <section className="w-full h-full flex flex-col gap-1">{children}</section>
  );
};

export default CollectionContentWrapper;
