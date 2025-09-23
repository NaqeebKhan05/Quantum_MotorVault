import Service from "@/shared/Service";
import { db } from "./../../configs";
import { CarImages, CarListing } from "./../../configs/schema";
import { eq, and, lte, sql, isNull } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarItem from "@/components/CarItem";
import Header from "@/components/Header";
import Search from "@/components/Search";
import Footer from "@/components/Footer";

function SearchByOptions() {
  const [searchParam] = useSearchParams();
  const [carList, setCarList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize params: treat "", "undefined", "null" as not provided
  const norm = (v) =>
    v && v !== "undefined" && v !== "null" && v !== "" ? v : undefined;
  const condition = norm(searchParam.get("cars"));
  const make = norm(searchParam.get("make"));
  const price = norm(searchParam.get("price"));

  useEffect(() => {
    GetCarList();
  }, [condition, make, price]); // refetch when query changes

  const GetCarList = async () => {
    setIsLoading(true);
    const filters = [];

    if (condition) {
      filters.push(eq(CarListing.condition, condition));
    }
    if (make) {
      filters.push(eq(CarListing.make, make));
    }
    if (price) {
      filters.push(
        lte(sql`CAST(${CarListing.sellingPrice} AS INTEGER)`, Number(price))
      );
    }

    // Always exclude sold or hidden cars
    filters.push(isNull(CarListing.sold));
    filters.push(isNull(CarListing.toggleVisibility));

    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(
        filters.length === 1
          ? filters[0]
          : filters.length > 1
          ? and(...filters)
          : undefined
      );

    const resp = Service.FormatResult(result);
    setCarList(resp);
    setIsLoading(false);
  };

  return (
    <div>
      <div className="p-3 bg-primary">
        <Header />
      </div>
      <div className="p-16 flex justify-center
      bg-gradient-to-r from-black via-[#001f3f] to-[#001f3f] 
      bg-gradient-to-t from-black via-[#001f3f] to-[#001f3f]">
        <Search />
      </div>

      <div className="p-10 md:px-20">
        <h2 className="font-bold text-4xl">Search Result</h2>

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

export default SearchByOptions;
