import LandingWrapper from "../../wrappers/landing-wrapper";
import Hero from "../../sections/hero";
import NavigationMenu from "../../components/headers/navigation-menu";
import GlowCard from "@components/cards/glow-card";

const LandingPage = () => {
  return (
    <LandingWrapper>
      <NavigationMenu />
      <Hero />
    </LandingWrapper>
  );
};

export default LandingPage;
