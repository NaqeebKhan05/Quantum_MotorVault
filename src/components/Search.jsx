// import React, { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { FaSearch } from "react-icons/fa";
// import Data from "../shared/Data";
// import { Link } from "react-router-dom";

// function Search() {
//   const [cars, setCars] = useState();
//   const [make, setMake] = useState();
//   const [price, setPrice] = useState();

//   // Only add params that have real values (avoid "undefined" in URL)
//   const buildSearchUrl = () => {
//     const params = new URLSearchParams();
//     if (cars) params.set("cars", String(cars));
//     if (make) params.set("make", String(make));
//     if (price) params.set("price", String(price));
//     const qs = params.toString();
//     return qs ? `/search?${qs}` : "/search";
//   };

//   return (
//     <div className="p-2 md:pd-5 bg-white rounded-md md:rounded-full flex-col md:flex md:flex-row gap-10 px-5 items-center w-[60%]">
//       {/*====================Car Filter (New, Used, Pre-Owned)=============================*/}
//       <Select onValueChange={(value) => setCars(value)}>
//         <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
//           <SelectValue placeholder="Cars" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="New">New</SelectItem>
//           <SelectItem value="Used">Used</SelectItem>
//           <SelectItem value="Certified Pre-Owned">
//             Certified Pre-Owned
//           </SelectItem>
//         </SelectContent>
//       </Select>

//       <Separator orientation="vertical" className="hidden md:block" />

//       {/*============================Car Brand Select Filter================================*/}
//       <Select onValueChange={(value) => setMake(value)}>
//         <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
//           <SelectValue placeholder="Car Makes" />
//         </SelectTrigger>
//         <SelectContent>
//           {Data.CarMakes.map((maker, index) => (
//             <SelectItem value={maker.name}>{maker.name}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Separator orientation="vertical" className="hidden md:block" />

//       {/*==================================Car Price Filter==================================*/}
//       <Select onValueChange={(value) => setPrice(value)}>
//         <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
//           <SelectValue placeholder="Pricing" />
//         </SelectTrigger>
//         <SelectContent>
//           {Data.Pricing.map((price, index) => (
//             <SelectItem value={price.amount}>{price.amount}$</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/*=======================Search Button with Search Icon================================*/}
//       {/* <Link to={'/search?cars='+cars+"&make="+make+"&price="+price}> */}
//       <Link to={buildSearchUrl()}>
//         <div>
//           <FaSearch className="text-[30px] bg-primary rounded-full p-3 text-white hover:scale-115 transition-all cursor-pointer" />
//         </div>
//       </Link>
//     </div>
//   );
// }

// export default Search;

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FaSearch } from "react-icons/fa";
import Data from "../shared/Data";
import { Link } from "react-router-dom";

function Search() {
  const [cars, setCars] = useState();
  const [make, setMake] = useState();
  const [price, setPrice] = useState();

  // Only add params that have real values (avoid "undefined" in URL)
  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (cars) params.set("cars", String(cars));
    if (make) params.set("make", String(make));
    if (price) params.set("price", String(price));
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  return (
    <div className="py-1 px-5 md:py-3 md:px-6 bg-white rounded-xl md:rounded-full flex-col md:flex md:flex-row gap-6 items-center w-[65%] shadow-lg border border-gray-300">
      {/*==================== Car Filter (New, Used, Pre-Owned) =============================*/}
      <Select onValueChange={(value) => setCars(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg text-gray-700">
          <SelectValue placeholder="Cars" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Used">Used</SelectItem>
          <SelectItem value="Certified Pre-Owned">
            Certified Pre-Owned
          </SelectItem>
        </SelectContent>
      </Select>

      <Separator
        orientation="vertical"
        className="hidden md:block bg-gray-300"
      />

      {/*============================ Car Brand Select Filter ================================*/}
      <Select onValueChange={(value) => setMake(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg text-gray-700">
          <SelectValue placeholder="Car Makes" />
        </SelectTrigger>
        <SelectContent>
          {Data.CarMakes.map((maker, index) => (
            <SelectItem key={index} value={maker.name}>
              {maker.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator
        orientation="vertical"
        className="hidden md:block bg-gray-300"
      />

      {/*================================== Car Price Filter ==================================*/}
      <Select onValueChange={(value) => setPrice(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg text-gray-700">
          <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent>
          {Data.Pricing.map((price, index) => (
            <SelectItem key={index} value={price.amount}>
              {price.amount}$
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/*======================= Search Button with Search Icon ================================*/}
      <Link to={buildSearchUrl()}>
        <div>
          <FaSearch className="text-[34px] bg-[#004080] rounded-full p-3 text-white hover:bg-black hover:scale-110 transition-all cursor-pointer shadow-md" />
        </div>
      </Link>
    </div>
  );
}

export default Search;
