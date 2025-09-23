import React, { useEffect, useState } from "react";
import { db } from "./../../../configs";
import { CarBooking, CarListing, CarImages } from "./../../../configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/clerk-react";
import { IoMdOpen } from "react-icons/io";
import { Link } from "react-router-dom";
import deleteBooking from "@/shared/DeleteBooking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RiDeleteBin5Fill } from "react-icons/ri";

function MyBooking() {
  const { user } = useUser(); // Get logged-in user from Clerk
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      console.log(
        "Fetching bookings for user:",
        user.primaryEmailAddress.emailAddress
      );
      setIsLoading(true);

      const result = await db
        .select()
        .from(CarBooking)
        .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
        .leftJoin(CarImages, eq(CarImages.carListingId, CarListing.id))
        .where(eq(CarBooking.bookedBy, user.primaryEmailAddress.emailAddress))
        .orderBy(CarBooking.id, "desc"); // ✅ Order applied here

      console.log("Raw bookings fetched:", result);

      // ✅ Group by booking ID to avoid duplicates caused by multiple images
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

      // ✅ Convert grouped object to array and sort descending by booking id
      const uniqueBookings = Object.values(grouped).sort(
        (a, b) => b.carBooking.id - a.carBooking.id
      );

      console.log("Grouped and sorted bookings:", uniqueBookings);
      setBookings(uniqueBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  // 🗑 Delete car listing + refresh
  const handleDelete = async (id) => {
    const success = await deleteBooking(id);
    if (success) {
      fetchMyBookings(); // refresh list after delete
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-4xl font-bold mb-2">My Bookings</h1>

      {isLoading ? (
        // ✅ Show skeletons while loading
        <div className="space-y-6">
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
      ) : bookings.length === 0 ? (
        // ✅ Show no bookings message after loading completes
        <div className="text-center text-gray-600 text-4xl">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, index) => {
            // Calculate the correct booking number in descending order
            const bookingNumber = bookings.length - index;
            //check if any errors
            console.log(
              "Booking Status for booking id:",
              booking.carBooking.id,
              booking.carBooking.bookingStatus
            );

            // Log each booking being rendered for debugging
            console.log(`Rendering Booking #${bookingNumber}`, booking);

            return (
              <div
                key={booking.carBooking.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border rounded-lg shadow-sm"
              >
                <Link
                  to={`/listing-details/${booking.carListing.id}`}
                  // className="text-blue-600 hover:text-blue-800 text-lg flex items-center gap-1"
                >
                  {/* Car Image */}
                  <div className="md:col-span-1">
                    <img
                      src={
                        booking.carImages.length > 0
                          ? booking.carImages[0].imageUrl
                          : ""
                      }
                      alt="Car"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <p className="mt-2 font-bold text-2xl">
                      {booking.carListing.make} {booking.carListing.model}    
                      <p className="flex text-sm text-blue-600">View Details <IoMdOpen /></p>
                    </p>
                    <p className="text-gray-700 text-xl">
                      {booking.carListing.year} • {booking.carListing.category}{" "}
                      • {booking.carListing.location}
                    </p>
                  </div>
                </Link>

                {/* Booking Info */}
                <div className="md:col-span-2">
                  <div className="flex gap-3">
                    <p className="font-bold text-3xl">
                      Rental Booking #{bookingNumber}
                    </p>{" "}
                    {/* Show the Booking Status */}
                    <span
                      className={`px-2 py-1 text-lg rounded-full font-semibold ${
                        booking.carBooking.bookingStatus === "Pending"
                          ? "bg-blue-100 text-blue-800"
                          : booking.carBooking.bookingStatus === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : booking.carBooking.bookingStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.carBooking.bookingStatus}
                    </span>
                  </div>
                  {/* ✅ Display descending booking number */}
                  <p className="text-gray-500 mt-2 font-bold text-xl">
                    Rental Period: {booking.carBooking.pickupDate} →{" "}
                    {booking.carBooking.returnDate}
                  </p>
                  <p className="text-gray-500 mt-2 font-bold text-xl">
                    Pickup Location: {booking.carListing.location}
                  </p>
                </div>

                {/* Price Info */}
                <div className="md:col-span-1 text-right">
                  <p className="text-gray-700 text-2xl">Total Price</p>
                  <h2 className="text-3xl font-bold text-blue-600 mb-22">
                    ${booking.carBooking.bookingAmount}
                  </h2>
                  {/* 🗑 Delete with confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <RiDeleteBin5Fill />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this car Booking?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The Car Booking info
                          will be permanently removed from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(booking.carBooking.id)}
                          className="bg-red-600 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBooking;
