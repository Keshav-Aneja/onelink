import StarButton from "@components/buttons/star-button";
import GlowCard from "./glow-card";
import { RiFileMarkedFill } from "react-icons/ri";
import Button from "@components/buttons/button";
const LinkCard = ({ data }: { data: { ogImage: string } }) => {
  //TODO: remove the data from here
  const { ogImage } = data;
  return (
    <GlowCard
      className="w-full h-card-xl rounded-md before:rounded-md after:rounded-md before:w-full before:h-60 border-[2px] border-white/20 text-white cursor-pointer "
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-col gap-2 rounded-md p-2 justify-start items-start"
      props={[
        (ondblclick = () => {
          //   navigate("/collections/web/material/react/nextjs/frontend");
        }),
      ]}
    >
      <section className="w-full h-30 rounded-md overflow-hidden bg-theme_secondary_black relative flex items-center justify-center select-none">
        {ogImage && ogImage.length > 0 ? (
          <img src="/images/abstract.webp" alt="" />
        ) : (
          <RiFileMarkedFill className="text-4xl" />
        )}
        <StarButton starred={true} />
      </section>
      <p className="text-base line-clamp-2 text-theme_secondary_white select-none">
        Lazar Nikov Clean Architecture Blog sheet
      </p>
      <section className="w-full flex justify-between items-center">
        <p className="text-secondary_text text-sm">
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
        <Button className="text-sm py-1">Detail</Button>
      </section>
    </GlowCard>
  );
};

export default LinkCard;
