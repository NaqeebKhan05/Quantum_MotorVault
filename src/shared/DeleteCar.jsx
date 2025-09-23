// src/shared/Delete.jsx
import { db } from "../../configs";
import { CarImages, CarListing } from "../../configs/schema";
import { eq } from "drizzle-orm";

export async function deleteCar(listingId) {
  try {
    // 1. Delete all images for this car
    await db.delete(CarImages).where(eq(CarImages.carListingId, listingId));

    // 2. Delete the car listing itself
    await db.delete(CarListing).where(eq(CarListing.id, listingId));

    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    return false;
  }
}
