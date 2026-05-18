import { useAppDispatch } from "@store/store";
import { Fragment, useEffect } from "react";
import { useStoredFavouriteLinks } from "@hooks/links";
import LinkCard from "@components/cards/link-card";
import { useLinks } from "@features/links/get-links";
import LinkCardSuspense from "@components/cards/link-card-suspense";
import Mascot from "@components/mascot";
import { addMultipleFavLinks } from "@store/slices/favourite-links-slice";
import { useSettings } from "@features/settings/get-settings";

const FavouriteLinksContent = () => {
  const links = useStoredFavouriteLinks();
  const dispatch = useAppDispatch();
  const { data: settingsData } = useSettings();
  const showOgImage = settingsData?.data?.show_og_image ?? true;

  // Fetch only when Redux cache is empty — no useState/useEffect cascade.
  const shouldFetch = !links || links.length === 0;
  const linkQuery = useLinks(shouldFetch, null, true);

  useEffect(() => {
    if (linkQuery.isSuccess && linkQuery.data?.data && shouldFetch) {
      dispatch(addMultipleFavLinks(linkQuery.data.data));
    }
  }, [linkQuery.isSuccess, linkQuery.data, shouldFetch, dispatch]);

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

  return (
    <Fragment>
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        {links.map((link, i) => (
          <LinkCard data={link} key={link.id} index={i} showOgImage={showOgImage} />
        ))}
      </div>
    </Fragment>
  );
};

export default FavouriteLinksContent;
