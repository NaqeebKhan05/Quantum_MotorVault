// import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
// import React from "react";
// import { Button } from "./ui/button";
// import { Link } from "react-router-dom";

// const Header = () => {
//   const { user, isSignedIn } = useUser();
//   return (
//     <div className="flex justify-between items-center shadow-sm px-8 h-16 bg-gray-200">
//       {/* ============================ Logo SVG and Brand Name ========================== */}
//       <Link to={"/"} className="h-full flex items-center">
//         <img
//           src="/logo.svg"
//           alt="Logo"
//           className="h-12 w-auto object-contain"
//         />
//         <h2 className="font-bold text-lg">
//           Quantum
//           <br />
//           MotorVault
//         </h2>
//       </Link>

//       {/* ============================ All Navigation Links ========================== */}
//       <ul className="hidden md:flex gap-10">
//         <Link to={"/"}>
//           <li className="font-medium hover:scale-110 transition-all cursor-pointer hover:text-primary">
//             Home
//           </li>
//         </Link>
//         <Link to={"/search"}>
//           <li className="font-medium hover:scale-110 transition-all cursor-pointer hover:text-primary">
//             Search
//           </li>
//         </Link>
//         <Link to={"/about"}>
//           <li className="font-medium hover:scale-110 transition-all cursor-pointer hover:text-primary">
//             About Us
//           </li>
//         </Link>
//         <Link to={"/contact"}>
//           <li className="font-medium hover:scale-110 transition-all cursor-pointer hover:text-primary">
//             Contact Us
//           </li>
//         </Link>
//       </ul>

//       {/* ===================== Sign In and Sell Your Car / Dashboard Buttons ==================== */}
//       <div className="flex items-center gap-4">
//         {/* Dashboard or Sell Your Car Button */}
//         {isSignedIn ? (
//           <div>
//             <Link to="/profile/my-listing">
//               <Button className="bg-primary text-white rounded-full px-6 hover:bg-black transition m-3">
//                 Rent / Sell Your Car
//               </Button>
//             </Link>
//             <Link to="/profile">
//               <Button className="bg-primary text-white rounded-full px-6 hover:bg-black transition">
//                 Dashboard {/* Changed from "Sell Your Car" to "Dashboard" */}
//               </Button>
//             </Link>
//           </div>
//         ) : (
//           // If user is not logged in, show Sell Your Car button that opens the Sign In modal
//           <SignInButton mode="modal">
//             <Button className="bg-primary text-white rounded-full px-6 hover:bg-black transition">
//               Rent / Sell Your Car
//             </Button>
//           </SignInButton>
//         )}

//         {/* Sign In Button - only when logged out */}
//         {!isSignedIn && (
//           <SignInButton mode="modal">
//             <Button
//               variant="outline"
//               className="rounded-full px-6 border border-black bg-gray-200 hover:bg-primary hover:text-white transition"
//             >
//               Sign In
//             </Button>
//           </SignInButton>
//         )}

//         {/* User Avatar - only when logged in */}
//         {isSignedIn && <UserButton />}
//       </div>
//     </div>
//   );
// };

// export default Header;

import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex justify-between items-center shadow-md px-8 h-16 bg-black text-white rounded-4xl">
      {/* ============================ Logo SVG and Brand Name ========================== */}
      <Link to={"/"} className="h-full flex items-center gap-2">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-12 w-auto object-contain"
        />
        <h2 className="font-bold text-lg leading-tight">
          Quantum
          <br />
          MotorVault
        </h2>
      </Link>

      {/* ============================ All Navigation Links ========================== */}
      <ul className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2">
        <Link to={"/"}>
          <li className="font-medium text-gray-300 hover:text-white hover:scale-120 transition-all cursor-pointer">
            Home
          </li>
        </Link>
        <Link to={"/search"}>
          <li className="font-medium text-gray-300 hover:text-white hover:scale-120 transition-all cursor-pointer">
            Search
          </li>
        </Link>
        <Link to={"/about"}>
          <li className="font-medium text-gray-300 hover:text-white hover:scale-120 transition-all cursor-pointer">
            About Us
          </li>
        </Link>
        <Link to={"/contact"}>
          <li className="font-medium text-gray-300 hover:text-white hover:scale-120 transition-all cursor-pointer">
            Contact Us
          </li>
        </Link>
      </ul>

      {/* ===================== Sign In and Sell Your Car / Dashboard Buttons ==================== */}
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <div className="flex gap-2">
            <Link to="/profile/my-listing">
              <Button className="bg-white text-black rounded-full px-6 hover:bg-primary hover:text-white transition">
                Rent / Sell Your Car
              </Button>
            </Link>
            <Link to="/profile">
              <Button className="bg-white text-black rounded-full px-6 hover:bg-primary hover:text-white transition">
                Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <SignInButton mode="modal">
            <Button className="bg-white text-black rounded-full px-6 hover:bg-primary hover:text-white transition">
              Rent / Sell Your Car
            </Button>
          </SignInButton>
        )}

        {/* Sign In Button - only when logged out */}
        {!isSignedIn && (
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="rounded-full px-6 border border-gray-400 bg-white text-black hover:bg-primary hover:text-white transition"
            >
              Sign In
            </Button>
          </SignInButton>
        )}

        {/* User Avatar - only when logged in */}
        {isSignedIn && <UserButton />}
      </div>
    </div>
  );
};

export default Header;
