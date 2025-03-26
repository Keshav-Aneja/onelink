import StarButton from "@components/buttons/star-button";
import GlowCard from "./glow-card";
import { RiFileMarkedFill } from "react-icons/ri";
import Button from "@components/buttons/button";
import { Link } from "@onelink/entities/models";
import { useAppDispatch } from "@store/store";
import { setSelectedLink } from "@store/slices/application-slice";
interface LinkCardProps {
  data: Link;
}
const LinkCard = ({ data }: LinkCardProps) => {
  const { open_graph } = data;
  const dispatch = useAppDispatch();
  const handleSelectLink = () => {
    dispatch(setSelectedLink(data));
  };
  return (
    <GlowCard
      className="w-full h-[15rem] xxl:h-[17rem] rounded-md before:rounded-md after:rounded-md before:w-full before:h-60 border-[2px] border-white/20 text-white cursor-pointer "
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-col gap-2 rounded-md p-2 justify-between items-start"
      onDoubleClick={() => {
        window.open(data.link, "_blank");
      }}
    >
      <div className="w-full flex flex-col gap-2">
        <section className="w-full aspect-[1.91]  rounded-md overflow-hidden bg-theme_secondary_black relative flex items-center justify-center select-none">
          {open_graph && open_graph.length > 0 ? (
            <img src={open_graph} alt="" loading="lazy" />
          ) : (
            <RiFileMarkedFill className="text-4xl" />
          )}
          <StarButton starred={data.is_starred ?? false} id={data.id} />
        </section>
        <span>
          <p className="text-sm xxl:text-base font-semibold line-clamp-2 text-theme_secondary_white select-none">
            {data.name}
          </p>
          <p className="text-xs text-theme_secondary_white/70 line-clamp-2">
            {data.site_description}
          </p>
        </span>
      </div>
      <section className="w-full flex justify-between items-center">
        <p className="text-secondary_text text-xs xxl:text-sm">
          {new Date().getDate() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getFullYear() +
            ", " +
            new Date().getHours() +
            ":" +
            new Date().getMinutes()}
        </p>
        <Button
          className="text-xs xxl:text-sm py-1 hover:bg-primary focus:bg-primary"
          onClick={handleSelectLink}
        >
          Detail
        </Button>
      </section>
    </GlowCard>
  );
};

export default LinkCard;
