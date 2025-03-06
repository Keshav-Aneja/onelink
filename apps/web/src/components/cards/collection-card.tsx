import { useNavigate } from "react-router";
import GlowCard from "./glow-card";
import { BiSolidFolder } from "react-icons/bi";
const CollectionCard = () => {
  const navigate = useNavigate();
  return (
    <GlowCard
      className="w-full h-32 xxl:h-40 rounded-md before:rounded-md after:rounded-md before:w-full before:h-60 border-[2px] border-white/20 text-white mt-8 cursor-pointer "
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-col gap-2 rounded-md"
      props={[
        (ondblclick = () => {
          navigate("/collections/web/material/react/nextjs/frontend");
        }),
      ]}
    >
      <BiSolidFolder className="text-7xl xxl:text-8xl text-theme_secondary_white" />
      <p className="text-base xxl:text-lg select-none">Blogs</p>
    </GlowCard>
  );
};

export default CollectionCard;
