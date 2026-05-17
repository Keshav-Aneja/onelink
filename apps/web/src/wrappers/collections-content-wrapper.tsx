import { ReactNode } from "react";

type CollectionContentWrapperProps = {
  children: ReactNode;
};
const CollectionContentWrapper = ({
  children,
}: CollectionContentWrapperProps) => {
  return (
    <section className={`flex-1 min-w-0 h-full flex flex-col gap-1`}>
      {children}
    </section>
  );
};

export default CollectionContentWrapper;
