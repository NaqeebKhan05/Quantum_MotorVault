import React from "react";
import { IoCalendar } from "react-icons/io5";
import { BsSpeedometer } from "react-icons/bs";
import { GiGearStickPattern } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";

function DetailHeader({ carDetail }) {
  return (
    <div>
      {carDetail?.listingTitle ? (
        <div>
          {/* Title & Tagline */}
          <h2 className="font-bold text-3xl">{carDetail?.listingTitle}</h2>
          <p className="text-sm">{carDetail?.tagline}</p>

          {/* Badges Row */}
          <div className="flex gap-3 mt-3 flex-wrap">
            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <IoCalendar className="h-5 w-5 text-primary" />
              <span className="text-primary text-sm">{carDetail?.year}</span>
            </div>

            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <BsSpeedometer className="h-5 w-5 text-primary" />
              <span className="text-primary text-sm">{carDetail?.mileage}</span>
            </div>

            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <GiGearStickPattern className="h-5 w-5 text-primary" />
              <span className="text-primary text-sm">{carDetail?.transmission}</span>
            </div>

            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <BsFillFuelPumpFill className="h-5 w-5 text-primary" />
              <span className="text-primary text-sm">{carDetail?.fuelType}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl h-[100px] bg-slate-200 animate-pulse"></div>
      )}
    </div>
  );
}

export default DetailHeader;
