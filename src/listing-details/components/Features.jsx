import React from "react";
import { FaCheck } from "react-icons/fa";

function Features({ features }) {
  console.log(features);

  // Handle null/undefined/empty
  if (!features || Object.keys(features).length === 0) {
    return (
      <div className="p-10 bg-white rounded-xl border shadow-md">
        <h2 className="font-medium text-2xl">Features</h2>
        <p className="mt-5 text-gray-500">No Features Checked</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-10 border rounded-xl shadow-md mt-7">
        <h2 className="font-medium text-2xl">Features</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 mt-5 lg:grid-cols-4">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex gap-2 items-center">
              <FaCheck className="text-lg p-1 rounded-full bg-blue-100" />
              <h2>{key}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
