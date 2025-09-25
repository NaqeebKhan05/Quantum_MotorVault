import React, { useEffect, useState } from "react";
import { db } from "./../../../configs";
import { CarBooking, CarListing, CarImages } from "./../../../configs/schema";
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
import AdminDashboard from "./../admin";
import { eq } from "drizzle-orm";

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllBookings = async () => {
    try {
      setIsLoading(true);
      const result = await db
        .select()
        .from(CarBooking)
        .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
        .leftJoin(CarImages, eq(CarImages.carListingId, CarListing.id))
        .orderBy(CarBooking.id, "desc");

      const grouped = result.reduce((acc, item) => {
        const bookingId = item.carBooking.id;
        if (!acc[bookingId]) {
          acc[bookingId] = { ...item, carImages: [] };
        }
        if (item.carImages) {
          acc[bookingId].carImages.push(item.carImages);
        }
        return acc;
      }, {});
      setBookings(Object.values(grouped));
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleDelete = async (id) => {
    const success = await deleteBooking(id);
    if (success) fetchAllBookings();
  };

  // ✅ Update booking status
  const updateBookingStatus = async (id, status) => {
    try {
      await db
        .update(CarBooking)
        .set({ bookingStatus: status })
        .where(eq(CarBooking.id, id));
      fetchAllBookings(); // refresh after update
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <div>
      <AdminDashboard />
      <div className="bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-6">All Bookings</h1>

        {isLoading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600 text-xl">No bookings found.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div
                key={booking.carBooking.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border rounded-lg shadow-sm"
              >
                <Link to={`/listing-details/${booking.carListing.id}`}>
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
                      <span className="flex text-sm text-blue-600">
                        View Details <IoMdOpen />
                      </span>
                    </p>
                    <p className="text-gray-700 text-xl">
                      {booking.carListing.year} • {booking.carListing.category}{" "}
                      • {booking.carListing.location}
                    </p>
                  </div>
                </Link>

                {/* Booking Info */}
                <div className="md:col-span-2">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold text-3xl">
                      Booking #{bookings.length - index}
                    </p>

                    {/* Actions: Dropdown for all statuses */}
                    <div className="flex flex-col justify-center text-2xl font-bold">
                      <select
                        value={booking.carBooking.bookingStatus}
                        onChange={(e) =>
                          updateBookingStatus(
                            booking.carBooking.id,
                            e.target.value
                          )
                        }
                        className="border rounded-md p-1 text-xl"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                                    <p className="text-gray-500 mt-1 font-bold text-xl">
                    Car Owner: {booking.carListing.createdBy}
                  </p>
                  <p className="text-gray-500 mt-2 font-bold text-xl">
                    Renter: {booking.carBooking.bookedBy}
                  </p>
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
                  {/* Delete Booking */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <RiDeleteBin5Fill />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this Booking?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllBookings;
