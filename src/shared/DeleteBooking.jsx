import { db } from "../../configs";
import { CarBooking } from "../../configs/schema";
import { eq } from "drizzle-orm";

async function deleteBooking(listingId) {
  try {
    // Delete the car booking itself
    await db.delete(CarBooking).where(eq(CarBooking.id, listingId));

    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    return false;
  }
}

export default deleteBooking;