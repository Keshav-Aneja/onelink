import { useAppDispatch, useAppSelector } from "@store/store";
import { Fragment, useEffect, useState } from "react";
import { useStoredLinks } from "@hooks/links";
import LinkCard from "@components/cards/link-card";
import { useLinks } from "@features/links/get-links";
import { addMultipleLinks } from "@store/slices/links-slice";
import LinkCardSuspense from "@components/cards/link-card-suspense";
import Mascot from "@components/mascot";

import { useStoredCollections } from "@hooks/collections";
import { getSecuredCollection } from "@store/slices/application-slice";
interface LinksContent {
  pathId: string | null;
}
const LinksContent = ({ pathId }: LinksContent) => {
  const collections = useStoredCollections(pathId);
  const links = useStoredLinks(pathId);
  const dispatch = useAppDispatch();
  const securedCollections = useAppSelector(getSecuredCollection);
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
      if (!links || links.length === 0) {
        console.log(securedCollections);
        dispatch(addMultipleLinks(linkQuery.data.data));
      }
    }
  }, [linkQuery.isSuccess, linkQuery.data, dispatch]);

  if (linkQuery.isLoading) {
    return (
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <LinkCardSuspense key={i} />
        ))}
      </div>
    );
  }

  if (
    (!links || links.length === 0) &&
    (!collections || collections.length === 0)
  ) {
    return <Mascot>No Collections or links found</Mascot>;
  }

  if (!links) {
    return null;
  }

  return (
    <Fragment>
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        {links.map((link) => (
          <LinkCard data={link} key={link.id} />
        ))}
      </div>
    </Fragment>
  );
};

export default LinksContent;
