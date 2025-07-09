import Hero from "@/components/Hero";
import Benefits from "@/components/Layout/Fitur/Fitur";
import Container from "@/components/Container";
import React from "react";
import FAQ from "@/components/Layout/FAQ/FAQ";

const HomePage: React.FC = () => {
  return (
    <React.Fragment>
      <Hero />
      <Container>
        <Benefits />
        <FAQ />
      </Container>
    </React.Fragment>
  );
};

export default HomePage;
