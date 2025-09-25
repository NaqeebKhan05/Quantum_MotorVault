import { Button } from "@/components/ui/button";
import { db } from "./../../../configs";
import { CarBooking, CarImages, CarListing } from "./../../../configs/schema";
import { desc, eq, or, ilike } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Service from "@/shared/Service";
import CarItem from "./../../components/CarItem";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { deleteCar } from "./../../shared/DeleteCar";
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
import { FaEye, FaEyeSlash, FaHandshake, FaSearch } from "react-icons/fa";
import AdminDashboard from "../admin";

function AdminCars() {
  const [carList, setCarList] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all cars for admin
  useEffect(() => {
    GetAllCarListing();
  }, []);

  const GetAllCarListing = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .orderBy(desc(CarListing.id));

    const resp = Service.FormatResult(result);
    setCarList(resp);
    setFilteredCars(resp); // show all by default
  };

  // Search cars
  const runSearch = async (q) => {
    if (!q.trim()) {
      setFilteredCars(carList);
      return;
    }
    const search = `%${q}%`;

    const result = await db
      .select()
      .from(CarListing)
      .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(
        or(
          ilike(CarListing.listingTitle, search),
          ilike(CarListing.tagline, search),
          ilike(CarListing.make, search),
          ilike(CarListing.model, search),
          ilike(CarListing.year, search),
          ilike(CarListing.sellingPrice, search),
          ilike(CarListing.bookingPrice, search),
          ilike(CarListing.category, search),
          ilike(CarListing.condition, search),
          ilike(CarListing.location, search),
          ilike(CarListing.createdBy, search),
          ilike(CarListing.userName, search),
          ilike(CarListing.sold, search)
        )
      )
      .orderBy(desc(CarListing.id));

    const resp = Service.FormatResult(result);
    setFilteredCars(resp);
  };

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      runSearch(searchQuery);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Delete car
  const handleDelete = async (id) => {
    const success = await deleteCar(id);
    if (success) GetAllCarListing();
  };

  // Mark as sold
  const handleSold = async (id) => {
    await db.update(CarListing).set({ sold: "yes" }).where(eq(CarListing.id, id));
    await db.delete(CarBooking).where(eq(CarBooking.carListingId, id));
    GetAllCarListing();
  };

  // Hide car
  const handleSee = async (id) => {
    await db.update(CarListing).set({ toggleVisibility: "no" }).where(eq(CarListing.id, id));
    GetAllCarListing();
  };

  // Show car
  const handleNoSee = async (id) => {
    await db.update(CarListing).set({ toggleVisibility: null }).where(eq(CarListing.id, id));
    GetAllCarListing();
  };

  return (
    <div>
      <AdminDashboard />
      <div className="mt-6 ml-10 mr-5">

        {/* Page Title & Add New Car */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-4xl mb-3">All Cars</h2>
          <Link to={"/admin/admin-addlisting"}>
            <Button> +Add New Car </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="py-2 px-5 md:py-3 md:px-6 bg-white rounded-xl md:rounded-full flex gap-3 items-center shadow-lg border border-gray-300 w-[70%] mx-auto">
          <input
            type="text"
            placeholder="Search cars by title, make, model, year, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-lg text-gray-700"
          />
          <FaSearch className="text-[34px] bg-[#004080] rounded-full p-3 text-white" />
        </div>

        {/* Car Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-5">
          {filteredCars.length === 0 && searchQuery && (
            <p className="text-gray-500">No cars found</p>
          )}
          {filteredCars.map((item, index) => (
            <div
              key={index}
              className={`relative ${item.sold === "yes" ? "grayscale opacity-70" : ""}`}
            >
              <CarItem car={item} />

              {item.sold === "yes" && (
                <div className="absolute top-3 right-3 bg-red-600 text-white font-bold text-sm px-3 py-1 rounded-md shadow-lg">
                  SOLD
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-gray-50 rounded-lg flex justify-between mt-2">
                {item.sold === "yes" ? (
                  <div
                    className="w-full flex justify-center items-center p-3 cursor-not-allowed"
                    onClick={() => alert("The Car is Already Sold.")}
                  >
                    <p className="text-red-600 font-semibold">The Car is Already Sold</p>
                  </div>
                ) : (
                  <>
                    <Link
                      to={"/admin/admin-addlisting?mode=edit&id=" + item?.id}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-fit bg-gray-500">
                        Edit
                      </Button>
                    </Link>

                    {item.toggleVisibility === "no" ? (
                      <Button onClick={() => handleNoSee(item.id)} variant="outline" className="bg-red-400">
                        <FaEye />
                      </Button>
                    ) : (
                      <Button onClick={() => handleSee(item.id)} variant="outline" className="bg-yellow-200">
                        <FaEyeSlash />
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="ml-3 mr-3 bg-green-300">
                          <FaHandshake /> SOLD
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Sale</AlertDialogTitle>
                          <AlertDialogDescription>
                            Marking this car as SOLD will delete all bookings.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleSold(item.id)} className="bg-green-600 text-white">
                            SOLD
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <RiDeleteBin5Fill />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Car?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. All images and info will be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 text-white">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminCars;
