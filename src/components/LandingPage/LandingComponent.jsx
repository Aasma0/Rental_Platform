import React from "react";
import HeroSection from "./HeroSection";
import CardsSection from "./CardsSection";
import ChessboardSection from "./ChessBoardSection";
import WhyChooseUsSection from "./Why";
import ContactUsSection from "./Contact";
import FAQsSection from "./FAQsSection";
import NavbarSection from "./NavBar";
import Footer from "./footer";

const LandingPage = () => {

  return (
    <div>
      <NavbarSection/>
      <HeroSection /> 
      <ChessboardSection />
      <CardsSection />
      <FAQsSection/>
      <WhyChooseUsSection />
      <ContactUsSection />
      <Footer/>
    </div>
  );
};

export default LandingPage;