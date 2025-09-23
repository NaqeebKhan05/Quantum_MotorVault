import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import DetailHeader from "../components/DetailHeader";
import { useParams } from "react-router-dom";
import { db } from "./../../../configs";
import { CarImages, CarListing } from "./../../../configs/schema";
import { eq } from "drizzle-orm";
import Service from "@/shared/Service";
import ImageGallery from "../components/ImageGallery";
import Description from "../components/Description";
import Features from "../components/Features";
import Specification from "../components/Specification";
import OwnersDetail from "../components/OwnersDetail";
import Footer from "@/components/Footer";
import FinancialCalculator from "../components/FinancialCalculator";
import MostSearchedCar from "@/components/MostSearchedCar";
import Booking from "../components/Booking";

function ListingDetial() {
  const { id } = useParams();
  console.log(id);
  const [carDetail, setCarDetail] = useState();

  useEffect(() => {
    GetCarDetail();
  }, []);

  const GetCarDetail = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.id, id));

    const resp = Service.FormatResult(result);

    console.log(resp[0]);
    setCarDetail(resp[0]); // ✅ set state so DetailHeader gets data
  };

  return (
    <div>
      <div className="p-3">
        <Header />
      </div>

      {/* Header Detail Compnents */}
      <div className="p-7 md:px-20">
        <DetailHeader carDetail={carDetail} />
      </div>

      {/* The Left and Right Side of Details Page */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {/* Left */}
        <div className="md:col-span-2 mx-20">
          {/* Image Gallery */}
          <ImageGallery carDetail={carDetail} />
          {/* Description  */}
          <Description carDetail={carDetail} />
          {/* Features List */}
          <Features features={carDetail?.features} />
          {/* Financial Calculator */}
          <FinancialCalculator carDetail={carDetail} />
        </div>

        {/* Right */}
        <div>
          {/* Price and Owners Details  */}
          <OwnersDetail carDetail={carDetail} />
          {/* Booking */}
          {carDetail && <Booking carDetail={carDetail} />}
          {/* Car Specifications  */}
          <Specification carDetail={carDetail} />
        </div>
      </div>

      <MostSearchedCar className="mb-10" />
      <div className="p-3">
        <Footer />
      </div>
    </div>
  );
}

export default ListingDetial;
