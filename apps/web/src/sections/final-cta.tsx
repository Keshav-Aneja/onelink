import { Link } from "react-router";
import { paths } from "@config/paths";
import { IoArrowForward } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";

const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-theme_primary_black">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[320px] lp-radial-blob pointer-events-none" />
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="text-center max-w-[680px] mx-auto">
          <h2 className="text-[2rem] md:text-[3rem] font-semibold tracking-tight leading-[1.05] lp-text-grad">
            Stop losing the web.
            <br />
            <span className="text-white">Start owning it.</span>
          </h2>
          <p className="mt-5 text-secondary_text">
            It takes about 30 seconds to sign up. No credit card, no nonsense.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={paths.auth.root.getHref()}
              className="lp-btn-primary inline-flex items-center gap-2 text-sm font-medium text-white rounded-full pl-5 pr-4 py-3"
            >
              Get Started — Free
              <IoArrowForward size={16} />
            </Link>
            <a
              href="https://github.com/Keshav-Aneja/onelink"
              target="_blank"
              rel="noreferrer"
              className="lp-btn-ghost inline-flex items-center gap-2 text-sm font-medium text-white rounded-full px-5 py-3"
            >
              <FaGithub size={14} /> Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
