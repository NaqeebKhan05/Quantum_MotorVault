import { Button } from "@/components/ui/button";
import { db } from "./../../../configs";
import { CarBooking } from "./../../../configs/schema";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Booking({ carDetail }) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [bookingAmount, setBookingAmount] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  // State for controlling dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);

  // Booking logic
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please Log In to Book a Car.");
      return;
    }

    if (!pickupDate || !returnDate || !bookingAmount) {
      alert("Please select valid dates.");
      return;
    }

    if (carDetail.createdBy === user.primaryEmailAddress.emailAddress) {
      setErrorDialog(true);
      return;
    }

    try {
      await db.insert(CarBooking).values({
        pickupDate,
        returnDate,
        bookingAmount: bookingAmount.toString(),
        carListingId: carDetail.id,
        bookedBy: user.primaryEmailAddress.emailAddress,
      });

      setPickupDate("");
      setReturnDate("");
      setBookingAmount(null);
      setOpenDialog(true);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong while saving the booking.");
    }
  };

  // Update booking amount based on dates
  useEffect(() => {
    if (pickupDate && returnDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);

      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 0;

      if (days > 0) {
        setBookingAmount(days * Number(carDetail.bookingPrice));
      } else {
        setBookingAmount(null);
      }
    } else {
      setBookingAmount(null);
    }
  }, [pickupDate, returnDate, carDetail.bookingPrice]);

  // Navigate to "My Bookings"
  const handleGotoMyBooking = () => {
    navigate("/profile/my-booking");
    setOpenDialog(false);
  };

  if (!carDetail) {
    return <div>Loading booking details...</div>;
  }

  return (
    <div className="p-6 border rounded-xl shadow-md max-w-2xl mx-auto mt-7 mr-10">
      {carDetail.bookingPrice && Number(carDetail.bookingPrice) > 0 ? (
        <>
          <form onSubmit={handleBooking} className="space-y-4">
            {/* Display Car Price */}
            <div>
              <h2 className="text-xl font-bold">
                Book this car for Daily Rental, per day cost is $
                {carDetail.bookingPrice}
              </h2>
            </div>

            {/* Input Pickup Date */}
            <div className="flex flex-col gap-2">
              <label htmlFor="pickupDate">Pickup Date</label>
              <input
                id="pickupDate"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="border p-2 rounded-md"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Input Return Date */}
            <div className="flex flex-col gap-2">
              <label htmlFor="returnDate">Return Date</label>
              <input
                id="returnDate"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="border p-2 rounded-md"
                required
                min={pickupDate || new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Show the Total Amount */}
            {bookingAmount !== null && (
              <div className="text-lg font-bold text-blue-600">
                Booking Amount: ${bookingAmount}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary-dull"
              disabled={
                user?.primaryEmailAddress?.emailAddress === carDetail?.createdBy
              }
              onClick={(e) => {
                if (
                  user?.primaryEmailAddress?.emailAddress ===
                  carDetail?.createdBy
                ) {
                  e.preventDefault(); // Prevent form submission
                  alert("You cannot Book your car for yourself");
                }
              }}
            >
              {user?.primaryEmailAddress?.emailAddress === carDetail?.createdBy
                ? "Owner cannot self Book"
                : user
                ? "Book Now"
                : "Please Log In for Booking a Car."}
            </Button>
          </form>

          {/* Booking Confirmation Dialog */}
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Car Booked!</AlertDialogTitle>
                <AlertDialogDescription>
                  Please message the owner for your booking approval and
                  updates.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                  OK
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleGotoMyBooking}
                  className="bg-primary text-white"
                >
                  View my bookings
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Error Dialog when booking own car */}
          <AlertDialog open={errorDialog} onOpenChange={setErrorDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Booking Error</AlertDialogTitle>
                <AlertDialogDescription>
                  You cannot book your own car!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setErrorDialog(false)}>
                  OK
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-gray-600">
            This car is <br /> not Available for Booking
          </h2>
        </div>
      )}
    </div>
  );
}

export default Booking;
