// import React from 'react'

// function Description({ carDetail }) {
//   return (
//     <div >
//       {carDetail?.listingDescription ? (
//         <div className='p-10 border rounded-xl shadow-md mt-7'>
//           <h2 className='my-2 font-medium text-2xl'>Description</h2>
//           <p>{carDetail?.listingDescription}</p>
//         </div>
//       ) : (
//         <div className='w-full h-[100px] mt-7 bg-slate-200 animate-pulse rounded-xl'></div>
//       )}
//     </div>
//   )
// }

// export default Description

import React from 'react'

function Description({ carDetail }) {
  return (
    <div>
      {carDetail?.listingDescription ? (
        <div className='p-6 md:p-10 border border-gray-300 rounded-2xl shadow-lg mt-7 bg-white'>
          <h2 className='mb-4 font-bold text-2xl text-[#0066CC]'>Description</h2>
          <p className='text-gray-700 text-base md:text-lg'>
            {carDetail?.listingDescription}
          </p>
        </div>
      ) : (
        <div className='w-full h-[100px] mt-7 bg-gray-300 animate-pulse rounded-2xl'></div>
      )}
    </div>
  )
}

export default Description
