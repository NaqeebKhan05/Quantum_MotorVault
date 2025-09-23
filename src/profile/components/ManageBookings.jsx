// import React, { useEffect, useState } from "react";
// import { db } from "./../../../configs";
// import { CarBooking, CarListing, CarImages } from "./../../../configs/schema";
// import { eq } from "drizzle-orm";
// import { useUser } from "@clerk/clerk-react";

// function ManageBooking() {
//   const { user } = useUser();
//   const [bookings, setBookings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchBookings = async () => {
//     try {
//       setIsLoading(true);
//       console.log("Fetching bookings for car owner:", user.primaryEmailAddress.emailAddress);

//       const result = await db
//         .select()
//         .from(CarBooking)
//         .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
//         .leftJoin(CarImages, eq(CarImages.carListingId, CarListing.id))
//         .where(eq(CarListing.createdBy, user.primaryEmailAddress.emailAddress))
//         .orderBy(CarBooking.id, "desc");

//       console.log("Fetched bookings:", result);

//       // Group by booking ID to avoid duplicates from multiple images
//       const grouped = result.reduce((acc, item) => {
//         const bookingId = item.carBooking.id;
//         if (!acc[bookingId]) {
//           acc[bookingId] = {
//             ...item,
//             carImages: [],
//           };
//         }
//         if (item.carImages) {
//           acc[bookingId].carImages.push(item.carImages);
//         }
//         return acc;
//       }, {});

//       const uniqueBookings = Object.values(grouped);
//       setBookings(uniqueBookings);
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateBookingStatus = async (bookingId, newStatus) => {
//     try {
//       await db
//         .update(CarBooking)
//         .set({ bookingStatus: newStatus })
//         .where(eq(CarBooking.id, bookingId));

//       console.log(`Booking ID ${bookingId} updated to ${newStatus}`);
//       fetchBookings(); // Refresh bookings after update
//     } catch (error) {
//       console.error("Error updating booking status:", error);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchBookings();
//     }
//   }, [user]);

//   if (isLoading) {
//     return <div>Loading bookings...</div>;
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-4xl font-bold mb-4">Manage Bookings</h1>
//       {bookings.length === 0 ? (
//         <div className="text-center text-gray-500">No bookings found.</div>
//       ) : (
//         <div className="space-y-6">
//           {bookings.map((booking) => (
//             <div key={booking.carBooking.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg shadow-sm">
//               {/* Car Image */}
//               <div>
//                 <img
//                   src={booking.carImages.length > 0 ? booking.carImages[0].imageUrl : ""}
//                   alt="Car"
//                   className="w-32 h-20 object-cover rounded-md"
//                 />
//               </div>

//               {/* Car Name */}
//               <div className="flex flex-col justify-center">
//                 <p className="font-semibold">
//                   {booking.carListing.make} {booking.carListing.model}
//                 </p>
//               </div>

//               {/* Date Range */}
//               <div className="flex flex-col justify-center">
//                 <p>{booking.carBooking.pickupDate} → {booking.carBooking.returnDate}</p>
//               </div>

//               {/* Total Amount */}
//               <div className="flex flex-col justify-center">
//                 <p>${booking.carBooking.bookingAmount}</p>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col justify-center">
//                 <select
//                   value={booking.carBooking.bookingStatus}
//                   onChange={(e) => updateBookingStatus(booking.carBooking.id, e.target.value)}
//                   className="border rounded-md p-1"
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="Accepted">Accepted</option>
//                   <option value="Rejected">Rejected</option>
//                 </select>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ManageBooking;

import React, { useEffect, useState } from "react";
import { db } from "./../../../configs";
import { CarBooking, CarListing, CarImages } from "./../../../configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function ManageBooking() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      console.log(
        "Fetching bookings for car owner:",
        user.primaryEmailAddress.emailAddress
      );

      const result = await db
        .select()
        .from(CarBooking)
        .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
        .leftJoin(CarImages, eq(CarImages.carListingId, CarListing.id))
        .where(eq(CarListing.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(CarBooking.id, "desc");

      console.log("Fetched bookings:", result);

      const grouped = result.reduce((acc, item) => {
        const bookingId = item.carBooking.id;
        if (!acc[bookingId]) {
          acc[bookingId] = {
            ...item,
            carImages: [],
          };
        }
        if (item.carImages) {
          acc[bookingId].carImages.push(item.carImages);
        }
        return acc;
      }, {});

      const uniqueBookings = Object.values(grouped);
      setBookings(uniqueBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await db
        .update(CarBooking)
        .set({ bookingStatus: newStatus })
        .where(eq(CarBooking.id, bookingId));

      console.log(`Booking ID ${bookingId} updated to ${newStatus}`);
      fetchBookings(); // Refresh bookings after update
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold mb-4">Manage Bookings</h1>
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border rounded-lg shadow-sm animate-pulse"
          >
            <div className="md:col-span-1 bg-gray-300 h-32 rounded-md"></div>
            <div className="md:col-span-2 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="md:col-span-1 space-y-2 text-right">
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-4">Manage Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-700 text-bold">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.carBooking.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg shadow-sm"
            >
              
                {/* Car Image */}
                <div>
                  <Link to={`/listing-details/${booking.carListing.id}`}>
                  <img
                    src={
                      booking.carImages.length > 0
                        ? booking.carImages[0].imageUrl
                        : ""
                    }
                    alt="Car"
                    className="w-50 h-38 object-cover rounded-md"
                  /></Link>
                </div>

                {/* Car Name */}
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-2xl">
                    {booking.carListing.make} {booking.carListing.model}
                  </p>
                </div>

                {/* Date Range */}
                <div className="flex flex-col justify-center text-xl font-semibold">
                  <p>
                    {booking.carBooking.pickupDate} →{" "}
                    {booking.carBooking.returnDate}
                  </p>
                </div>

                {/* Total Amount */}
                <div className="flex flex-col justify-center text-center text-2xl font-bold text-blue-600">
                  <p>${booking.carBooking.bookingAmount}</p>
                </div>

                {/* Actions: Show select for Pending, badge for others */}
                <div className="flex flex-col justify-center text-2xl font-bold">
                  {booking.carBooking.bookingStatus === "Pending" ? (
                    <select
                      value={booking.carBooking.bookingStatus}
                      onChange={(e) =>
                        updateBookingStatus(
                          booking.carBooking.id,
                          e.target.value
                        )
                      }
                      className="border rounded-md p-1"
                    >
                      <option value="Pending" className="text-center">
                        Pending
                      </option>
                      <option value="Accepted" className="text-center">
                        Accepted
                      </option>
                      <option value="Rejected" className="text-center">
                        Rejected
                      </option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 text-xl text-center rounded-full font-bold ${
                        booking.carBooking.bookingStatus === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : booking.carBooking.bookingStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.carBooking.bookingStatus}
                    </span>
                  )}
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageBooking;
