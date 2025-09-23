import IconField from "@/add-listing/components/IconField";
import CarSpecification from "@/shared/CarSpecification";
import React from "react";

function Specification({ carDetail }) {
  console.log(carDetail);

  if (!carDetail) {
    // Skeleton loader while waiting
    return (
      <div className="p-10 rounded-xl border shadow-md mt-7 mr-10">
        <h2 className="font-medium text-2xl">Specification</h2>
        <div className="h-[200px] w-full bg-slate-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-10 rounded-xl border shadow-md mt-7 mr-10">
      <h2 className="font-medium text-2xl">Specification</h2>
      {CarSpecification.map((item, index) => (
        <div key={index} className="mt-5 flex items-center justify-between">
          <h2 className="flex gap-2">
            <IconField icon={item?.icon} />
            {item?.label}
          </h2>
          <h2>{carDetail?.[item?.name] || "-"}</h2>
        </div>
      ))}
    </div>
  );
}

export default Specification;
