// import Search from "./Search";
// import React from "react";

// const Hero = () => {
//   return (
//     <div className="flex flex-col items-center p-1 py-4 h-[460px] w-full bg-black">
//       <h2 className="text-lg text-white">Find car for sale and for rent near you</h2>
//       <h2 className="text-[60px] text-white font-bold">Find Your Dream Car</h2>

//       <Search />
//       <img src="tesla.png" className="mt-3 h-full w-[950px] object-fill" />
//     </div>
//   );
// };

// export default Hero;

import Search from "./Search";
import React from "react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center h-[460px] w-full 
      bg-gradient-to-r from-black via-[#001f3f] to-[#001f3f] 
      bg-gradient-to-t from-black via-[#001f3f] to-[#001f3f]">
      <h2 className="text-lg text-gray-300">
        Find car for sale and for rent near you
      </h2>
      <h2 className="text-[60px] font-bold text-white drop-shadow-lg">
        Find Your Dream Car
      </h2>

      <Search />
      <img
        src="tesla.png"
        className="mt-3 h-full w-[900px] object-fill"
      />
    </div>
  );
};

export default Hero;
