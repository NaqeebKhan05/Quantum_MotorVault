import Header from "@/components/Header";
import Search from "@/components/Search";
import { db } from "./../../../configs";
import { CarImages, CarListing } from "./../../../configs/schema";
import { and, eq, isNull } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Service from "@/shared/Service";
import CarItem from "@/components/CarItem";
import Footer from "@/components/Footer";

function SearchByCategory() {
  const { category } = useParams();
  const [carList, setCarList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetCarList();
  }, []);

  const GetCarList = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(
        and(
          eq(CarListing.category, category),
          isNull(CarListing.sold),
          isNull(CarListing.toggleVisibility)
        )
      );

    const resp = Service.FormatResult(result);
    setCarList(resp);
    setIsLoading(false);
  };

  return (
    <div>
      <div className="p-3">
      <Header />
</div>
      <div className="p-16 bg-black flex justify-center">
        <Search />
      </div>

      {/* List of Cars */}
      <div className="p-10 md:px-20">
        <h2 className="font-bold text-4xl">{category}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="h-[300px] rounded-xl bg-slate-200 animate-pulse"
              />
            ))
          ) : carList.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No Cars Found
            </p>
          ) : (
            carList.map((item, index) => (
              <div key={index}>
                <CarItem car={item} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="p-3">
        <Footer/>
      </div>
    </div>
  );
}

export default SearchByCategory;
