import GlowCard from "@components/cards/glow-card";
import { IoMdArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router";
import { Pages } from "@config/constants";
import { useCheckSession } from "@hooks/user";
import { useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const sessionExists = useCheckSession();

  useEffect(() => {
    if (sessionExists) {
      navigate(Pages.COLLECTIONS);
    }
  }, [sessionExists]);

  return (
    <>
      <h1 className="w-[90%] md:w-full text-[1.75rem] md:text-[3.5rem] xl:text-[4rem] xxl-text-[5rem] leading-[2.5rem] md:leading-[3.5rem] xl:leading-[4rem] xxl:leading-[5rem]  text-center xl:max-w-[55vw] xxl:max-w-[50vw] font-semibold text-primary_text">
        Centralized Bookmark Manager for Modern Life
      </h1>
      <p className="text-sm md:text-base xxl:text-[1.5rem] font-light text-secondary_text text-center max-w-[90%] md:max-w-[50vw]">
        Effortlessly capture your online trail with organized links and
        intuitive session tracking—turn your browsing into a sleek,
        well-organized resource.
      </p>
      <GlowCard
        className="w-48 md:w-60 h-10 md:h-14 xl:scale-80 xxl:scale-100 rounded-full before:w-60 before:h-20 border-[2px] border-white/20 text-white mt-8 cursor-pointer"
        style={{ "--color-gradient": "red" }}
      >
        <Link
          to={sessionExists ? Pages.COLLECTIONS : Pages.AUTHENTICATION}
          className="rounded-full w-full h-full flex items-center justify-center gap-3 md:gap-6 cursor-pointer group hover:shadow-lg shadow-white/30  transition-all duration-200 ease-linear text-base md:text-lg font-medium"
        >
          <span>Get Started</span>
          <IoMdArrowForward className="bg-primary rounded-full text-white text-xl p-0.5 group-hover:bg-primary/70 transition-all duration-200 ease-linear" />
        </Link>
      </GlowCard>
      <div className="--bg-pattern relative">
        <div className="w-full h-[30vh] bg-linear-180 from-black to-transparent fixed bottom-0 left-0 z-[-1]"></div>
        <div className="--bg-grid-container w-full h-[30vh] fixed bottom-0 left-0 z-[-2]"></div>
      </div>
    </>
  );
};

export default Hero;
