import React from "react";
import HeroSection from "./HeroSection";
import CardsSection from "./CardsSection";
import ChessboardSection from "./ChessBoardSection";
import StatsSection from "./StatsSection";
import WhyChooseUsSection from "./Why";
import ContactUsSection from "./Contact";

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <CardsSection />
      <ChessboardSection />
      <StatsSection />
      <WhyChooseUsSection />
      <ContactUsSection />
    </div>
  );
};

export default LandingPage;
