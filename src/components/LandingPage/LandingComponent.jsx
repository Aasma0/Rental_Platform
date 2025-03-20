import React from "react";
import HeroSection from "./HeroSection";
import CardsSection from "./CardsSection";
import ChessboardSection from "./ChessBoardSection";
import WhyChooseUsSection from "./Why";
import FAQsSection from "./FAQsSection";
import NavbarSection from "./NavBar";
import Footer from "./footer";

const LandingPage = () => {
  return (
    <div>
      <NavbarSection pageType="landing" />
      <HeroSection /> 
      <ChessboardSection />
      <CardsSection />
      <FAQsSection/>
      <WhyChooseUsSection />
      <Footer/>
    </div>
  );
};

export default LandingPage;
