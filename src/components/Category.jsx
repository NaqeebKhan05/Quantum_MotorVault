// import Data from "@/shared/Data";
// import React from "react";
// import { Link } from "react-router-dom";

// const Category = () => {
//   return (
//     <div className="mt-40 pt-10">
//       <h2 className="font-bold text-3xl text-center mb-6 mt-4">Browse by Type</h2>

//       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 px-20">
//         {Data.Category.map((category, index) => (
//           <Link to={"search/" + category.name}>
//             <div className="border-2 rounded-xl p-3 items-center flex flex-col hover:shadow-md hover:scale-130 cursor-pointer">
//               <img src={category.icon} width={35} height={35} />
//               <h2 className="mt-2">{category.name}</h2>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Category;

import Data from "@/shared/Data";
import React from "react";
import { Link } from "react-router-dom";

const Category = () => {
  return (
    <div className="mt-40 pt-10 bg-white">
      <h2 className="font-bold text-3xl text-center mb-6 mt-4 text-gray-900">
        Browse by Type
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 px-20">
        {Data.Category.map((category, index) => (
          <Link key={index} to={"search/" + category.name}>
            <div className="border-2 border-gray-300 bg-gray-50 rounded-xl p-3 items-center flex flex-col hover:bg-blue-900 hover:text-white hover:shadow-lg hover:scale-115 transition-all duration-200 cursor-pointer">
              <img
                src={category.icon}
                width={35}
                height={35}
                className="text-gray-800"
                alt={category.name}
              />
              <h2 className="mt-2 text-sm font-semibold">{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
