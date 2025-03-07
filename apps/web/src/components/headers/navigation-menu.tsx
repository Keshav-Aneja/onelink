import GlowCard from "@components/cards/glow-card";
import { paths } from "@config/paths";
import { Link } from "react-router";

const NavigationMenu = () => {
  return (
    <GlowCard className="w-[30%] min-h-12 xxl:min-h-16 rounded-full before:w-[30%] before:h-32 border-[1px] border-white/20 absolute top-8 xxl:top-16">
      <nav className="bg-transparent w-full h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img
            src="/images/logo.webp"
            alt=""
            width={120}
            height={120}
            className="w-8 xxl:w-10 h-auto hue-rotate-90"
          />
          <h3 className="text-lg xxl:text-xl font-medium">OneLink</h3>
        </div>
        <ul className="flex items-center text-sm xxl:text-base text-theme_secondary_white/80">
          <Link
            to={paths.auth.getHref()}
            className="hover:text-theme_primary_white px-3 py-1"
          >
            Login
          </Link>
          <Link
            to="https://keshavaneja.in"
            className="hover:text-theme_primary_white px-3 py-1"
          >
            Creator
          </Link>
        </ul>
      </nav>
    </GlowCard>
  );
};

export default NavigationMenu;
