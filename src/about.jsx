import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

function About() {
  return (
    <div className="bg-white">
      <div className="p-3">
        <Header />
      </div>

      {/* Mission & Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {/* Right Side Image Section */}
        <div className="relative order-last">
          <img
            src="/QV3DModel.jpg"
            alt="Quantum MotorVault 3D Model"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient to fade into black */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        </div>

        {/* left Side Section */}
        <div className="md:col-span-2 bg-black text-white flex items-center order-first">
          <section className="py-12 px-10">
            <h1 className="text-4xl font-bold">About Us</h1>
            <p className="mt-4 text-gray-300 max-w-2xl mb-9">Discover hassle-free car rentals across Karnataka. Whether you’re traveling for business or leisure, our platform helps you find trusted vehicles at competitive rates. Enjoy secure bookings, quick pickups, and 24/7 customer support—all in one place.From Bangalore to Mysore, Mangalore to Hubli — drive with confidence anywhere in Karnataka.</p> 
            <h2 className="text-2xl font-bold">Mission And Values</h2>
            <p className="mt-4 text-gray-300 max-w-2xl">
              Our mission is to provide exceptional car rental & sales services
              with a focus on availability, reliability and support.
            </p>

            <div className="flex space-x-8 mt-8 animate-fadeIn">
              <div className="transition transform hover:scale-110">
                <h3 className="text-xl font-bold">85+</h3>
                <p className="text-gray-300">Specialists</p>
              </div>
              <div className="transition transform hover:scale-110">
                <h3 className="text-xl font-bold">25+</h3>
                <p className="text-gray-300">Years of Experience</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Our Vision Section */}
      <section className="bg-primary text-white py-12 px-4">
        <h2 className="text-2xl font-bold text-center">Our Vision</h2>
        <p className="mt-4 text-center max-w-2xl mx-auto">
          Healthcare anytime, anywhere. We aim to revolutionize the healthcare
          industry by making quality healthcare accessible to everyone.
        </p>
      </section>

      {/* FAQs Section */}
      <section className="text-center py-12 px-4 w-full">
        <h2 className="text-2xl font-bold">
          Get Answer To Your Most Asked Questions
        </h2>
        <div className="mt-8 space-y-4">
          {[
            {
              q: "How do I Book cars online?",
              a: "You can book any car online through our website.",
            },
            {
              q: "What types of services do you offer?",
              a: "We offer car rental and sales services with management tools for the car owner.",
            },
            {
              q: "Do you accept online payments?",
              a: "No, Right now we don't accept any online payments.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow-md transition transform hover:scale-100 scale-90"
            >
              <h3 className="text-xl font-bold">{faq.q}</h3>
              <p className="mt-2 text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="p-3">
        <Footer />
      </div>
    </div>
  );
}

export default About;
