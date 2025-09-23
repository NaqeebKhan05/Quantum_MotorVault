// import React, { useEffect, useState } from "react";
// import CarItem from "./CarItem";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { and, desc, eq, inArray, isNull } from "drizzle-orm";
// import { CarImages, CarListing } from "./../../configs/schema";
// import { db } from "./../../configs";
// import Service from "./../shared/Service";
// import Autoplay from "embla-carousel-autoplay";

// function MostSearchedCar() {
//   const [carList, setCarList] = useState([]);

//   useEffect(() => {
//     GetPopularCarList();
//   }, []);

//  const GetPopularCarList = async () => {
//   try {
//     // Step 1: Get latest 10 unique car IDs excluding sold/hidden cars
//     const carIds = await db
//       .select({ id: CarListing.id })
//       .from(CarListing)
//       .where(
//         and(
//           isNull(CarListing.sold),
//           isNull(CarListing.toggleVisibility)
//         )
//       )
//       .orderBy(desc(CarListing.id))
//       .limit(6);

//     // Step 2: Fetch cars + their images for those IDs
//     const result = await db
//       .select()
//       .from(CarListing)
//       .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
//       .where(inArray(CarListing.id, carIds.map((c) => c.id)));

//     console.log("DB raw result:", result.length, result);

//     // Step 3: Format result into unique cars with images
//     const resp = Service.FormatResult(result);
//     console.log("Formatted unique cars:", resp.length, resp);

//     setCarList(resp);
//   } catch (error) {
//     console.error("Error fetching cars:", error);
//   }
// };


//   return (
//     <div className="mx-24">
//       <h2 className="font-bold text-3xl text-center mt-16 mb-7">
//         Most Searched Cars
//       </h2>

//       <Carousel plugins={[Autoplay({ delay: 4000 })]}>
//         <CarouselContent>
//           {carList.map((car, index) => (
//             <CarouselItem
//               key={index}
//               className="basis-1/2 sm:basis-1/2 md:basis-1/4 lg:basis-1/5"
//             >
//               <CarItem car={car} />
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious />
//         <CarouselNext />
//       </Carousel>
//     </div>
//   );
// }

// export default MostSearchedCar;

import React, { useEffect, useState } from "react";
import CarItem from "./CarItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { CarImages, CarListing } from "./../../configs/schema";
import { db } from "./../../configs";
import Service from "./../shared/Service";
import Autoplay from "embla-carousel-autoplay";

function MostSearchedCar() {
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    GetPopularCarList();
  }, []);

  const GetPopularCarList = async () => {
    try {
      const carIds = await db
        .select({ id: CarListing.id })
        .from(CarListing)
        .where(
          and(isNull(CarListing.sold), isNull(CarListing.toggleVisibility))
        )
        .orderBy(desc(CarListing.id))
        .limit(6);

      const result = await db
        .select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
        .where(inArray(CarListing.id, carIds.map((c) => c.id)));

      const resp = Service.FormatResult(result);
      setCarList(resp);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  return (
    <div className="mx-24">
      <h2 className="font-bold text-3xl text-center mt-16 mb-7">
        Most Searched Cars
      </h2>

      <Carousel
        opts={{ loop: true }} // ✅ enable infinite loop
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnInteraction: false, // keeps autoplay even after clicking arrows
            stopOnMouseEnter: true,   // ✅ pause autoplay on hover
          }),
        ]}
      >
        <CarouselContent>
          {carList.map((car, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 sm:basis-1/2 md:basis-1/4 lg:basis-1/5"
            >
              <CarItem car={car} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default MostSearchedCar;
