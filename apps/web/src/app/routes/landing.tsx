import Hero from "../../sections/hero";
import NavigationMenu from "../../components/headers/navigation-menu";
import BaseWrapper from "@wrappers/base-wrapper";

const LandingPage = () => {
  return (
    <BaseWrapper>
      <NavigationMenu />
      <Hero />
    </BaseWrapper>
  );
};

export default LandingPage;
