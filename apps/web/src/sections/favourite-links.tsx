import { useAppDispatch } from "@store/store";
import { Fragment, useEffect, useState } from "react";
import { useStoredFavouriteLinks } from "@hooks/links";
import LinkCard from "@components/cards/link-card";
import { useLinks } from "@features/links/get-links";
import LinkCardSuspense from "@components/cards/link-card-suspense";
import Mascot from "@components/mascot";
import { addMultipleFavLinks } from "@store/slices/favourite-links-slice";

const FavouriteLinksContent = () => {
  const links = useStoredFavouriteLinks();
  const dispatch = useAppDispatch();
  const [shouldFetchLinks, setShouldFetchLinks] = useState<boolean>(
    !links || links.length === 0,
  );
  const linkQuery = useLinks(shouldFetchLinks, null, true);

  useEffect(() => {
    setShouldFetchLinks(!links || links.length === 0);
  }, []);

  useEffect(() => {
    if (linkQuery.isSuccess && linkQuery.data?.data) {
      setShouldFetchLinks(false);
      if (!links || links.length === 0) {
        dispatch(addMultipleFavLinks(linkQuery.data.data));
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

  if (!links || links.length === 0) {
    return <Mascot>No links found</Mascot>;
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

export default FavouriteLinksContent;
