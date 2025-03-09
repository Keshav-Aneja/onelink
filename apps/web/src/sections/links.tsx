import { useAppDispatch } from "@store/store";
import { Fragment, useEffect, useState } from "react";
import Loader from "../app/loader";
import { useStoredLinks } from "@hooks/links";
import LinkCard from "@components/cards/link-card";
import { useLinks } from "@features/links/get-links";
import { addMultipleLinks } from "@store/slices/links-slice";
interface LinksContent {
  pathId: string | null;
}
const LinksContent = ({ pathId }: LinksContent) => {
  const links = useStoredLinks(pathId);
  const dispatch = useAppDispatch();

  const [shouldFetchLinks, setShouldFetchLinks] = useState<boolean>(
    !links || links.length === 0,
  );
  const linkQuery = useLinks(shouldFetchLinks, pathId);

  useEffect(() => {
    setShouldFetchLinks(!links || links.length === 0);
  }, [pathId]);

  useEffect(() => {
    if (linkQuery.isSuccess && linkQuery.data?.data) {
      setShouldFetchLinks(false);
      if (!links) {
        dispatch(addMultipleLinks(linkQuery.data.data));
      }
    }
  }, [linkQuery.isSuccess, linkQuery.data, dispatch]);

  if (linkQuery.isLoading) {
    return <Loader />;
  }
  if (!links) {
    return <p>No stored links found</p>;
  }
  return (
    <Fragment>
      {links.length === 0 && <p className="text-center">No links found</p>}
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        {links.map((link) => (
          <LinkCard data={link} key={link.id} />
        ))}
      </div>
    </Fragment>
  );
};

export default LinksContent;
