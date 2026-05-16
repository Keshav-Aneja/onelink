import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Pages } from "@config/constants";
import { useCheckSession } from "@hooks/user";
import NavigationMenu from "../../components/headers/navigation-menu";
import Hero from "../../sections/hero";
import ProductMockup from "../../sections/product-mockup";
import Features from "../../sections/features";
import SocialProof from "../../sections/social-proof";
import FinalCTA from "../../sections/final-cta";
import Footer from "../../components/footer";
import { Gradient } from "../../assets/Gradient.js";

const LandingPage = () => {
  const navigate = useNavigate();
  const sessionExists = useCheckSession();

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  useEffect(() => {
    if (sessionExists) {
      navigate(Pages.COLLECTIONS);
    }
  }, [sessionExists]);

  return (
    <>
      <div className="w-full min-h-screen absolute bg-black top-0 left-0">
        <div className="w-full h-screen absolute top-0 left-0 bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgba(17,17,17,1)] z-[100] scroller-animation"></div>
        <canvas
          id="gradient-canvas"
          data-transition-in
          className="w-full min-h-screen h-fit fixed top-0 left-0 --hero-bg scroller-animation"
        />
      </div>
      <div className="min-h-screen bg-[#0b0b0b] text-white">
        <NavigationMenu />
        <Hero />
        <ProductMockup />
        <Features />
        <SocialProof />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
