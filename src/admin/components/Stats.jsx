import React, { useEffect, useState } from "react";
import { db } from "./../../../configs";
import { CarListing, CarBooking } from "./../../../configs/schema";
import { LuNotepadText } from "react-icons/lu";
import AdminDashboard from "./../admin";

// ================== Stats Component ===================
const Stats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [soldCars, setSoldCars] = useState(0);
  const [hiddenCars, setHiddenCars] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);
  const [totalRentRevenue, setTotalRentRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cars = await db.select().from(CarListing);
        setTotalCars(cars.length);

        const uniqueUsers = [...new Set(cars.map((c) => c.createdBy))];
        setTotalUsers(uniqueUsers.length);

        const sold = cars.filter((c) => c.sold === "yes");
        setSoldCars(sold.length);

        const hidden = cars.filter((c) => c.toggleVisibility === "no");
        setHiddenCars(hidden.length);

        const salesRevenue = sold.reduce(
          (acc, car) => acc + (parseFloat(car.sellingPrice) || 0),
          0
        );
        setTotalSalesRevenue(salesRevenue);

        const bookings = await db
          .select()
          .from(CarBooking)
          .orderBy(CarBooking.id, "desc")
          .limit(3);
        setRecentBookings(bookings);

        const acceptedBookings = await db
          .select()
          .from(CarBooking)
          .where({ bookingStatus: "Accepted" });

        const rentRevenue = acceptedBookings.reduce(
          (acc, b) => acc + (parseFloat(b.bookingAmount) || 0),
          0
        );
        setTotalRentRevenue(rentRevenue);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <AdminDashboard />
      <div className=" bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatBox title="Total Users" value={totalUsers} color="blue" />
          <StatBox title="Cars Listed" value={totalCars} color="green" />
          <StatBox title="Cars Sold" value={soldCars} color="purple" />
          <StatBox title="Hidden Cars" value={hiddenCars} color="red" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-5 border">
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            {recentBookings.length === 0 ? (
              <p>No recent bookings</p>
            ) : (
              recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between border-b py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <LuNotepadText className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-semibold">
                        Booking #{b.id} - {b.bookingStatus}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Amount: ${b.bookingAmount}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Revenue */}
          <div className="bg-white shadow rounded-lg p-6 border flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Total Revenue
            </h2>
            <p className="text-xl">Sales: ${totalSalesRevenue.toFixed(2)}</p>
            <p className="text-xl">Bookings: ${totalRentRevenue.toFixed(2)}</p>
            <p className="text-3xl mt-4 font-bold text-green-600">
              ${(totalSalesRevenue + totalRentRevenue).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================== Reusable Stat Box ===================
const StatBox = ({ title, value, color }) => (
  <div
    className={`bg-white shadow rounded-lg p-5 border-l-4 border-${color}-500`}
  >
    <h4 className="text-gray-700 text-lg font-bold">{title}</h4>
    <p className="text-3xl font-extrabold">{value}</p>
  </div>
);

export default Stats;
