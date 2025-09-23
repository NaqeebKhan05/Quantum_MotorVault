import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { db } from "./../../../configs";
import { CarBooking, CarImages, CarListing } from "./../../../configs/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Service from "@/shared/Service";
import CarItem from "./../../components/CarItem";
import { RiDeleteBin5Fill } from "react-icons/ri";
// ⬇️ new imports for delete + confirmation popup
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
import { FaEye, FaEyeSlash, FaHandshake } from "react-icons/fa";

function MyListing() {
  const { user } = useUser();
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    user && GetUserCarListing();
  }, [user]);

  // 🔄 Fetch listings for logged-in user
  const GetUserCarListing = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(CarListing.id));

    const resp = Service.FormatResult(result);
    setCarList(resp);
  };

  // 🗑 Delete car listing + refresh
  const handleDelete = async (id) => {
    const success = await deleteCar(id);
    if (success) {
      GetUserCarListing(); // refresh list after delete
    }
  };

  // Sale of Car handling (Update the Database with "yes" for carListing.sold and delete car bookings if any)
  const handleSold = async (id) => {
    try {
      // Step 1: Mark the car as sold
      await db
        .update(CarListing)
        .set({ sold: "yes" })
        .where(eq(CarListing.id, id));

      console.log(`Car with ID ${id} marked as sold.`);

      // Step 2: Delete all bookings related to this car
      await db.delete(CarBooking).where(eq(CarBooking.carListingId, id));

      console.log(`All bookings for car ID ${id} have been deleted.`);

      // Step 3: Refresh the listing to reflect the changes
      GetUserCarListing();
    } catch (error) {
      console.error("Error marking car as sold and deleting bookings:", error);
    }
  };

  // Visibility handling (Update the Database with "no" for carListing.toggleVisibility to hide the car)
  const handleSee = async (id) => {
    try {
      await db
        .update(CarListing)
        .set({ toggleVisibility: "no" }) // Hide the car
        .where(eq(CarListing.id, id));

      console.log(`Car with ID ${id} is now hidden.`);
      GetUserCarListing(); // Refresh the list after update
    } catch (error) {
      console.error("Error hiding car:", error);
    }
  };

  // Visibility handling (Update the Database with null for carListing.toggleVisibility to show the car)
  const handleNoSee = async (id) => {
    try {
      await db
        .update(CarListing)
        .set({ toggleVisibility: null }) // Make car visible
        .where(eq(CarListing.id, id));

      console.log(`Car with ID ${id} is now visible.`);
      GetUserCarListing(); // Refresh the list after update
    } catch (error) {
      console.error("Error making car visible:", error);
    }
  };

  return (
    <div className="mt-6">
      {/* First Section of My Cars Listing Page */}
      <div className="flex justify-between items-center">
        {/* My Cars Title */}
        <h2 className="font-bold text-4xl">My Cars </h2>

        {/* Add New Cars Button */}
        <Link to={"/add-listing"}>
          <Button> +Add New Car </Button>
        </Link>
      </div>

      {/* 🏎️ Car Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-5">
        {carList.map((item, index) => (
          <div
            key={index}
            className={`relative ${
              item.sold === "yes" ? "grayscale opacity-70" : ""
            }`}
          >
            <CarItem car={item} />

            {/* SOLD stripe overlay (always red) */}
            {item.sold === "yes" && (
              <div
                className="absolute top-3 right-3 bg-red-600 text-white font-bold text-sm px-3 py-1 rounded-md shadow-lg"
                style={{ filter: "none", opacity: 1 }}
              >
                SOLD
              </div>
            )}

            {/* Buttons Section */}
            <div className="bg-gray-50 rounded-lg flex justify-between mt-2">
              {item.sold === "yes" ? (
                // 🚫 Disabled state with toast
                <div
                  className="w-full flex justify-center items-center p-3 cursor-not-allowed"
                  onClick={() => {
                    alert("The Car is Already Sold.");
                  }}
                >
                  <p className="text-red-600 font-semibold">
                    The Car is Already Sold
                  </p>
                </div>
              ) : (
                <>
                  {/* ✏️ Edit Button */}
                  <Link
                    to={"/add-listing?mode=edit&id=" + item?.id}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-fit bg-gray-500">
                      Edit
                    </Button>
                  </Link>

                  {/* Toggle Visibility Button */}
                  {item.toggleVisibility === "no" ? (
                    <Button
                      onClick={() => handleNoSee(item.id)}
                      variant="outline"
                      className="bg-red-400"
                    >
                      <FaEye />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSee(item.id)}
                      variant="outline"
                      className="bg-yellow-200"
                    >
                      <FaEyeSlash />
                    </Button>
                  )}

                  {/* The Sold button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-3 mr-3 bg-green-300"
                      >
                        <FaHandshake /> SOLD
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Please confirm if this car is sold?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Select "Cancel" if your
                          car is not sold, click on "SOLD" if your car is sold.
                          <br />
                          <p className="text-red-600">
                            Any Rental Booking Made on this car will be Rejected
                            and Deleted.
                          </p>
                          <br /> Check Dashboard for your Sales Revenue.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleSold(item.id)}
                          className="bg-green-600 text-white"
                        >
                          SOLD
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

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
                          Are you sure you want to delete this car?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. All images and listing
                          info will be permanently removed from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 text-white"
                        >
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
  );
}

export default MyListing;
