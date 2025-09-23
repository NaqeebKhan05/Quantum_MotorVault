import React from "react";

function InfoSection() {
  return (
    <section className="relative w-full h-[350px] rounded-3xl overflow-hidden mt-5">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D"
        alt="Luxury Car"
        className="w-full h-full object-cover rounded-4xl"
      />

      {/* Overlay Gradient on Left */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[rgba(0,0,0,0.85)] to-transparent" />

      {/* Content Layer */}
      <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-12 lg:px-20">
        {/* Text Section */}
        <div className="max-w-lg text-left text-white z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#004080]">
            Quantum MotorVault <br/> Car Rental & Sales.
          </h2>
          <p className="mt-4 text-lg text-gray-200">
            Discover hassle-free car rentals across Karnataka. Whether you’re
            traveling for business or leisure, our platform helps you find
            trusted vehicles at competitive rates. Enjoy secure bookings, quick
            pickups, and 24/7 customer support—all in one place.
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            From Bangalore to Mysore, Mangalore to Hubli — drive with confidence
            anywhere in Karnataka.
          </p>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
