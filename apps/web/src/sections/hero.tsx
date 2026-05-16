import { Link } from "react-router";
import { paths } from "@config/paths";
import { IoArrowForward, IoChevronDown } from "react-icons/io5";
import { FaStar, FaShield } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";

const Hero = () => {
  return (
    <section
      id="top"
      className="relative pt-16 md:pt-24 pb-24 md:pb-32 overflow-hidden z-[100]"
    >
      <div className="absolute inset-0 lp-bg-grid lp-bg-grid-fade pointer-events-none" />
      <div className="absolute left-1/2 top-[140px] -translate-x-1/2 w-[820px] h-[420px] lp-radial-blob pointer-events-none" />
      <div
        className="absolute inset-x-0 bottom-0 h-60 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #111111 95%)",
        }}
      />

      <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Badge */}
        <div className="lp-fade-in flex justify-center">
          <span className="inline-flex items-center gap-2 text-xs text-white/80 border border-white/45 bg-black/10 rounded-full px-3.5 py-1.5 ">
            <HiSparkles size={12} className="text-primary" />
            Open source and free forever
          </span>
        </div>

        {/* Headline */}
        <h1 className="lp-fade-in lp-delay-1 mt-6 text-center font-semibold tracking-[-0.025em] leading-[1.02] text-[2.25rem] md:text-[3.6rem] xl:text-[4.5rem]">
          <span className="lp-text-grad">Your entire web,</span>
          <br />
          <span className="lp-text-grad">organized in </span>
          <span className="relative inline-block">
            <span className="relative z-10 text-white">one place</span>
            <span
              className="absolute left-0 right-0 bottom-1.5 h-3 bg-primary/40 -z-0 rounded-sm"
              aria-hidden="true"
            />
          </span>
          <span className="text-primary">.</span>
        </h1>

        {/* Subhead */}
        <p className="lp-fade-in lp-delay-2 mt-6 text-center text-white/80 text-base md:text-lg max-w-[640px] mx-auto leading-relaxed">
          OneLink is a centralized bookmark manager for developers and
          researchers. Capture links, build collections, and find anything —
          instantly.
        </p>

        {/* CTAs */}
        <div className="lp-fade-in lp-delay-3 mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={paths.auth.root.getHref()}
            className="bg-white inline-flex items-center gap-2 text-sm font-medium text-black rounded-full pl-5 pr-4 py-3"
          >
            Get Started — Free
            <IoArrowForward size={16} />
          </Link>
          <a
            href="#features"
            className="lp-btn-ghost inline-flex items-center gap-2 text-sm font-medium text-white rounded-full px-5 py-3"
          >
            See how it works
            <IoChevronDown size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
