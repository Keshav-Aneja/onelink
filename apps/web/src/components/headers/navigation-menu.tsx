import { useState, useEffect } from "react";
import { Link } from "react-router";
import { paths } from "@config/paths";
import { IoArrowForward } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";

const NavigationMenu = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-3 z-[1000] px-4 ">
      <div className="mx-auto max-w-295">
        <div
          data-scrolled={scrolled}
          className="lp-nav-pill px-2 py-2 flex items-center gap-2"
        >
          <a
            href="#top"
            className="relative z-10 flex items-center gap-2 pl-3 pr-2 py-1 rounded-full"
          >
            <img
              src="/images/logo.webp"
              alt="OneLink"
              className="w-6 h-auto hue-rotate-90"
            />
            <span className="text-[15px] font-semibold tracking-tight">
              OneLink
            </span>
          </a>

          <div className="flex-1" />

          <nav className="hidden md:flex relative z-10 items-center gap-1 text-sm text-theme_secondary_white">
            <a
              href="#features"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              Features
            </a>
            <a
              href="#preview"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              Preview
            </a>
            <a
              href="https://www.linkedin.com/in/keshav-aneja/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition"
            >
              Creator
            </a>
            <a
              href="https://github.com/Keshav-Aneja/onelink"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
            >
              <FaGithub size={14} /> GitHub
            </a>
          </nav>

          <Link
            to={paths.auth.root.getHref()}
            className="lp-btn-primary relative z-10 inline-flex items-center gap-1.5 text-sm font-medium text-white rounded-full px-4 py-2 ml-1"
          >
            Get Started <IoArrowForward size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
