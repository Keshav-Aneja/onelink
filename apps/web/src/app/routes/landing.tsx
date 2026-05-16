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

const LandingPage = () => {
  const navigate = useNavigate();
  const sessionExists = useCheckSession();

  useEffect(() => {
    if (sessionExists) {
      navigate(Pages.COLLECTIONS);
    }
  }, [sessionExists]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <NavigationMenu />
      <Hero />
      <ProductMockup />
      <Features />
      <SocialProof />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
