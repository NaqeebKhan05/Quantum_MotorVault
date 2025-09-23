// import { Separator } from "@/components/ui/separator";
// import React from "react";
// import { BsFillFuelPumpFill } from "react-icons/bs";
// import { BsSpeedometer } from "react-icons/bs";
// import { GiGearStickPattern } from "react-icons/gi";
// import { IoMdOpen } from "react-icons/io";
// import { Link } from "react-router-dom";

// function CarItem({ car }) {
//   return (
//     <Link to={"/listing-details/" + car?.id}>
//       <div className="rounded-xl bg-white border hover:shadow-md hover:scale-102 cursor-pointer">

//         {/* Text on Top Left Corner of Car Image for (New or Old) Display */}
//         <h2 className="absolute m-2 bg-green-500 px-2 rounded-full text-sm text-white">
//           New
//         </h2>

//         {/* Image for CarItem Card  */}
//         {car?.images?.length > 0 && (
//           <img
//             src={car.images[0].imageUrl}
//             width={"100%"}
//             height={250}
//             className="rounded-t-xl h-[140px] object-cover"
//           />
//         )}

//         {/* CarItem Card Details with Icons */}
//         <div className="p-4">
//           <h2 className="font-bold text-black text-lg mb-2">
//             {car?.listingTitle}
//           </h2>
//           <Separator />
//           <div className="grid grid-cols-3 mt-5">
//             <div className="flex flex-col items-center">
//               <BsFillFuelPumpFill className="text-lg  mb-2" />
//               <h2>{car?.fuelType} </h2>
//             </div>
//             <div className="flex flex-col items-center">
//               <BsSpeedometer className="text-lg  mb-2" />
//               <h2>{car?.mileage} 
//                 {/* <br/> <p className="justify-between">Miles</p> */}
//                 </h2>
//             </div>
//             <div className="flex flex-col items-center">
//               <GiGearStickPattern className="text-lg  mb-2" />
//               <h2>{car?.transmission}</h2>
//             </div>
//           </div>
//           <Separator className="my-2" />
//           <div className="flex items-center justify-between">
//             <h2 className="font-bold text-xl">${car?.sellingPrice}</h2>
//             <h2 className="text-primary text-sm flex gap-2 items-center">
//               View Details
//               <IoMdOpen />
//             </h2>
//           </div>
//         </div>
        
//       </div>
//     </Link>
//   );
// }

// export default CarItem;

import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { BsSpeedometer } from "react-icons/bs";
import { GiGearStickPattern } from "react-icons/gi";
import { IoMdOpen } from "react-icons/io";
import { Link } from "react-router-dom";

function CarItem({ car }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Skeleton Loader
    return (
      <div className="rounded-xl bg-white border p-4 animate-pulse">
        <div className="h-6 w-28 bg-gray-300 rounded mb-2"></div>
        <div className="h-[140px] w-full bg-gray-200 rounded mb-3"></div>
        <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
      </div>
    );
  }

  return (
    <Link to={"/listing-details/" + car?.id}>
      <div className="relative rounded-xl bg-white border hover:shadow-md hover:scale-102 cursor-pointer">
        {/* Top Left Booking Price or Fallback */}
        <h2 className="absolute m-2 bg-blue-600 px-2 rounded-full text-xl text-white">
          {car?.bookingPrice ? `$${car.bookingPrice} / per day` : "Car Not For Rent"}
        </h2>

        {/* Image for CarItem Card */}
        {car?.images?.length > 0 ? (
          <img
            src={car.images[0].imageUrl}
            width={"100%"}
            height={250}
            className="rounded-t-xl h-[140px] object-cover"
            alt={car?.listingTitle}
          />
        ) : (
          <div className="rounded-t-xl h-[140px] bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {/* CarItem Card Details with Icons */}
        <div className="p-4">
          <h2 className="font-bold text-black text-lg mb-2">
            {car?.listingTitle}
          </h2>
          <Separator />
          <div className="grid grid-cols-3 mt-5">
            <div className="flex flex-col items-center">
              <BsFillFuelPumpFill className="text-lg mb-2" />
              <h2>{car?.fuelType}</h2>
            </div>
            <div className="flex flex-col items-center">
              <BsSpeedometer className="text-lg mb-2" />
              <h2>{car?.mileage}</h2>
            </div>
            <div className="flex flex-col items-center">
              <GiGearStickPattern className="text-lg mb-2" />
              <h2>{car?.transmission}</h2>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">Sale Price: ${car?.sellingPrice}</h2>
            <h2 className="text-blue-600 text-sm flex gap-2 items-center">
              View Details
              <IoMdOpen />
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CarItem;
