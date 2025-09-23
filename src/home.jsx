import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Category from "./components/Category";
import MostSearchedCar from "./components/MostSearchedCar";
import InfoSection from "./components/InfoSection";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";

const Home = () => {
  return (
    <div>
      {/* Header */}
      <div className="p-3 bg-[#001f3f]">
        <Header />
      </div>

      {/* Hero */}
      <Hero />

      {/* Category */}
      <Category />

      {/* Most Searched Car */}
      <MostSearchedCar />

      {/* Information Section */}
      <div className="p-3">
        <InfoSection />
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer Section  */}
      <div className="p-3">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
