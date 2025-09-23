import React, { useEffect, useState } from "react";
import { db } from "../../../configs"; // Drizzle ORM instance
import { CarListing, CarBooking } from "../../../configs/schema"; // Tables
import { useUser } from "@clerk/clerk-react"; // For getting logged-in user info
import { eq, and, count } from "drizzle-orm"; // Drizzle helpers
import { LuNotepadText } from "react-icons/lu"; // List icon for recent bookings

const Dashboard = () => {
  const { user } = useUser(); // Clerk hook to get user data
  const [totalCars, setTotalCars] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [totalRentRevenue, setTotalRentRevenue] = useState(0);
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        console.log("Logged in user email:", userEmail);

        // ✅ Total Cars: count of CarListings created by this user
        const totalCarsResult = await db
          .select({ count: count() })
          .from(CarListing)
          .where(eq(CarListing.createdBy, userEmail));

        console.log("Total cars result:", totalCarsResult);
        setTotalCars(totalCarsResult?.[0]?.count || 0);

        // ✅ Total Bookings: count of CarBookings where linked CarListing's createdBy matches this user
        const totalBookingsResult = await db
          .select({ count: count() })
          .from(CarBooking)
          .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
          .where(eq(CarListing.createdBy, userEmail));

        console.log("Total bookings result:", totalBookingsResult);
        setTotalBookings(totalBookingsResult?.[0]?.count || 0);

        // ✅ Pending Bookings: count where bookingStatus is 'Pending' and linked CarListing's createdBy matches this user
        const pendingBookingsResult = await db
          .select({ count: count() })
          .from(CarBooking)
          .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
          .where(
            and(
              eq(CarListing.createdBy, userEmail),
              eq(CarBooking.bookingStatus, "Pending")
            )
          );

        console.log("Pending bookings result:", pendingBookingsResult);
        setPendingBookings(pendingBookingsResult?.[0]?.count || 0);

        // ✅ Confirmed Bookings: count where bookingStatus is 'Accepted' and linked CarListing's createdBy matches this user
        const confirmedBookingsResult = await db
          .select({ count: count() })
          .from(CarBooking)
          .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
          .where(
            and(
              eq(CarListing.createdBy, userEmail),
              eq(CarBooking.bookingStatus, "Accepted")
            )
          );

        console.log("Confirmed bookings result:", confirmedBookingsResult);
        setConfirmedBookings(confirmedBookingsResult?.[0]?.count || 0);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchRecentBookingsAndRevenue = async () => {
      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        console.log(
          "Fetching recent bookings and total revenue for:",
          userEmail
        );

        // ✅ Recent Bookings – join CarBooking with CarListing, filter by owner, sorted by booking.id desc, limit 3
        const bookings = await db
          .select({
            booking: CarBooking,
            listing: CarListing,
          })
          .from(CarBooking)
          .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
          .where(eq(CarListing.createdBy, userEmail))
          .orderBy(CarBooking.id, "desc")
          .limit(3);

        console.log("Recent bookings:", bookings);
        setRecentBookings(bookings);

        // ✅ Total Rental Revenue – only include bookings with status "Accepted"
        const acceptedBookings = await db
          .select({
            booking: CarBooking,
            listing: CarListing,
          })
          .from(CarBooking)
          .innerJoin(CarListing, eq(CarBooking.carListingId, CarListing.id))
          .where(
            and(
              eq(CarListing.createdBy, userEmail),
              eq(CarBooking.bookingStatus, "Accepted")
            )
          );

        const total = acceptedBookings.reduce((acc, item) => {
          const amount = parseFloat(item.booking.bookingAmount) || 0;
          return acc + amount;
        }, 0);

        console.log("Total accepted booking revenue:", total);
        setTotalRentRevenue(total);

        // Total Sales Revenue 
        const soldCars = await db
        .select()
        .from(CarListing)
        .where(and(eq(CarListing.createdBy, userEmail), eq(CarListing.sold, "yes")));
      
        const totalSales = soldCars.reduce((acc, car) => {
         const price = parseFloat(car.sellingPrice) || 0;
         return acc + price;
      }, 0);

        console.log("Total Sales Revenue: ", totalSales );
        setTotalSalesRevenue(totalSales);

      } catch (error) {
        console.error("Error fetching recent bookings and revenue:", error);
      }
    };

    fetchRecentBookingsAndRevenue();
  }, [user]);

  return (
    <div className="mt-4">
      <div className="justify-between items-center">
        {/* Dashboard Title */}
        <h2 className="font-bold text-4xl">My Dashboard</h2>
        {/* ===================================The Number Box's Section============================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {/* Total Cars Box */}
          <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between border-4 border-gray-400">
            <div>
              <h4 className="text-gray-700 text-2xl font-bold">Total Cars</h4>
              <p className="text-2xl font-bold">{totalCars}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13l4-4 3 3 7-7 4 4M3 3h6v6H3V3z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Total Bookings Box */}
          <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between border-4 border-gray-400">
            <div>
              <h4 className="text-gray-700 text-2xl font-bold">Total Bookings</h4>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-4a2 2 0 014 0v4m5 4H6a2 2 0 01-2-2V7a2 2 0 012-2h5.5l2 2H20a2 2 0 012 2v9a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Pending Bookings Box */}
          <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between border-4 border-gray-400">
            <div>
              <h4 className="text-gray-700 text-2xl font-bold">Pending Bookings</h4>
              <p className="text-2xl font-bold">{pendingBookings}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Confirmed Bookings Box */}
          <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between border-4 border-gray-400">
            <div>
              <h4 className="text-gray-700 text-2xl font-bold">Confirmed</h4>
              <p className="text-2xl font-bold">{confirmedBookings}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-indigo-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/*========================Recent Bookings and Total Revenue's Section=============================*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-3">
          {/* Box One: Recent Bookings */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-5 space-y-4 border-4 border-gray-400">
            <h2 className="text-4xl font-bold">Recent Bookings</h2>
            <h2 className="text-xl text-gray-500">Latest Customer Bookings</h2>

            {recentBookings.length === 0 ? (
              <p>No recent bookings found.</p>
            ) : (
              recentBookings.map((item) => (
                <div
                  key={item.booking.id}
                  className="flex flex-col gap-2 border-b pb-4 last:border-none"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <LuNotepadText className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="font-bold text-xl  ">
                      {item.listing.listingTitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-xl font-bold">
                    <div className="bg-gray-100 p-1 rounded-full">
                      Pickup:{" "}
                      {new Date(item.booking.pickupDate).toLocaleDateString()}
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div>${item.booking.bookingAmount}</div>
                      <div
                        className={`px-2 py-1 rounded-full text-lg font-semibold ${
                          item.booking.bookingStatus === "Pending"
                            ? "bg-blue-100 text-blue-800"
                            : item.booking.bookingStatus === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : item.booking.bookingStatus === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.booking.bookingStatus}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Box Two: Total Rental Revenue */}
          <div className="bg-white shadow rounded-lg p-5 flex flex-col justify-center items-center space-y-4 border-4 border-gray-400">
            <h2 className="text-4xl font-bold text-primary p-5 text-center">REVENUE EARNED</h2>
            <h2 className="text-2xl font-bold">Total Rental Revenue</h2>
            <h2 className="text-6xl text-primary">
              ${totalRentRevenue.toFixed(2)}
            </h2>
            <h2 className="text-2xl font-bold">Total Sales Revenue</h2>
            <h2 className="text-6xl text-primary">
              ${totalSalesRevenue.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
