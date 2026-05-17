import StarButton from "@components/buttons/star-button";
import GlowCard from "./glow-card";
import { RiExternalLinkLine } from "react-icons/ri";
import { Link } from "@onelink/entities/models";
import DeleteLinkButton from "@components/buttons/delete-link-button";
import formatLink from "@lib/utils/format-link";
import { useSettings } from "@features/settings/get-settings";
import SubscribeButton from "@components/buttons/subscribe-button";
import { MoveToCollectionModal } from "@components/dialogs/move-to-collection-modal";
import { useState } from "react";
import { TbFolderShare } from "react-icons/tb";

interface LinkCardProps {
  data: Link;
  height?: string;
  index?: number;
}

const LinkCard = ({ data, height = "15rem", index }: LinkCardProps) => {
  const { open_graph } = data;
  const { data: settings } = useSettings();
  const showOgImage = settings?.data?.show_og_image ?? true;
  const hasImage = showOgImage && open_graph && open_graph.length > 0;
  const [moveOpen, setMoveOpen] = useState(false);

  if (!hasImage) {
    return (
      <>
        <GlowCard
          className="group w-full rounded-none before:rounded-md after:rounded-md before:w-full before:h-full border-[1px] border-white/20 text-white cursor-pointer"
          style={{ minHeight: "11rem" }}
          containerClassName="flex-col gap-2 rounded-md p-3 justify-between items-start"
          onDoubleClick={() => {
            window.open(data.link, "_blank");
          }}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex justify-between items-center">
              {index !== undefined && (
                <span className="text-[0.6rem] text-theme_secondary_white/40 font-mono select-none">
                  #{String(index + 1).padStart(3, "0")}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <span
                  className={
                    !data.is_starred
                      ? "opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      : ""
                  }
                >
                  <StarButton
                    starred={data.is_starred ?? false}
                    id={data.id}
                    subtle
                  />
                </span>
                <span
                  className={
                    !data.subscribed
                      ? "opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      : ""
                  }
                >
                  <SubscribeButton
                    subscribed={data.subscribed ?? false}
                    id={data.id}
                    subtle
                  />
                </span>
                <div className="hidden group-hover:flex items-center gap-1.5">
                  <button
                    className="text-sm cursor-pointer text-theme_secondary_white/40 hover:text-theme_secondary_white transition-colors"
                    title="Move to collection"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoveOpen(true);
                    }}
                  >
                    <TbFolderShare />
                  </button>
                  <DeleteLinkButton id={data.id} subtle />
                  <button
                    className="text-sm cursor-pointer text-theme_secondary_white/40 hover:text-theme_secondary_white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(data.link, "_blank");
                    }}
                  >
                    <RiExternalLinkLine />
                  </button>
                </div>
              </div>
            </div>
            <span>
              <p className="text-xs md:text-sm xxl:text-base font-semibold line-clamp-2 text-theme_secondary_white select-none">
                {data.name}
              </p>
              <p className="text-[0.55rem] md:text-xs text-theme_secondary_white/40 select-none mt-0.5 font-mono">
                {formatLink(data.link)}
              </p>
              <p className="text-[0.55rem] md:text-xs text-theme_secondary_white/70 line-clamp-2 select-none mt-2">
                {data.site_description}
              </p>
            </span>
          </div>
        </GlowCard>
        {moveOpen && (
          <MoveToCollectionModal link={data} onClose={() => setMoveOpen(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <GlowCard
        className="w-full rounded-none before:rounded-md after:rounded-md before:w-full before:h-60 border-[1px] border-white/20 text-white cursor-pointer"
        style={{
          height: `calc(${height} + 2.5rem)`,
        }}
        containerClassName="flex-col gap-2 rounded-md p-2 justify-between items-start"
        onDoubleClick={() => {
          window.open(data.link, "_blank");
        }}
      >
        <div className="w-full flex flex-col gap-2">
          <section className="w-full aspect-[1.91] rounded-md overflow-hidden bg-theme_secondary_black relative flex items-center justify-center select-none">
            <img src={open_graph} alt="" loading="lazy" />
            <span className="text-[0.55rem] md:text-xs text-theme_secondary_white font-bold absolute bottom-1 md:bottom-2 right-2 md:right-3">
              {formatLink(data.link)}
            </span>
            <section className="absolute top-2 right-2 w-full flex items-center gap-1 justify-end">
              <StarButton starred={data.is_starred ?? false} id={data.id} />
            </section>
          </section>
          <span>
            <p className="text-xs md:text-sm xxl:text-base font-semibold line-clamp-2 text-theme_secondary_white select-none">
              {data.name}
            </p>

            <p className="text-[0.55rem] md:text-xs text-theme_secondary_white/70 line-clamp-2 select-none">
              {data.site_description}
            </p>
          </span>
        </div>
        <section className="w-full flex justify-between items-center relative">
          <div className="flex items-center gap-1.5">
            <DeleteLinkButton id={data.id} />
            <button
              className="text-sm cursor-pointer text-theme_secondary_white/40 hover:text-theme_secondary_white transition-colors"
              title="Move to collection"
              onClick={(e) => {
                e.stopPropagation();
                setMoveOpen(true);
              }}
            >
              <TbFolderShare />
            </button>
          </div>
          <SubscribeButton subscribed={data.subscribed ?? false} id={data.id} subtle />
        </section>
      </GlowCard>
      {moveOpen && (
        <MoveToCollectionModal link={data} onClose={() => setMoveOpen(false)} />
      )}
    </>
  );
};

export default LinkCard;
