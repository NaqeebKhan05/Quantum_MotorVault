import React, { useEffect, useState } from "react";
import carDetails from "./../../shared/carDetails.json";
import features from "./../../shared/features.json";
import Service from "./../../shared/Service";
import InputField from "./../../add-listing/components/InputField";
import DropDownField from "./../../add-listing/components/DropDownField";
import TextAreaField from "./../../add-listing/components/TextAreaField";
import UploadImages from "./../../add-listing/components/UploadImages";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BiLoaderAlt } from "react-icons/bi";
import { db } from "./../../../configs";
import { CarListing, CarImages } from "./../../../configs/schema";
import { eq } from "drizzle-orm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import moment from "moment";
import { toast } from "sonner";
import AdminDashboard from "../admin";

function AdminAddListing() {
  const [formData, setFormData] = useState({});
  const [featuresData, setFeaturesData] = useState({});
  const [triggerUploadImages, setTriggerUploadImages] = useState();
  const [loader, setLoader] = useState(false);
  const [carInfo, setCarInfo] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const recordId = searchParams.get("id");

  // Fetch all users (from Clerk or unique createdBy from CarListing)
  const fetchUsers = async () => {
    try {
      // Option 1: Get unique emails from carListing table (lightweight)
      const result = await db
        .select({ email: CarListing.createdBy })
        .from(CarListing);
      const uniqueEmails = [...new Set(result.map((r) => r.email))];
      setAllUsers(uniqueEmails);
    } catch (e) {
      console.error("Error fetching users:", e);
      toast("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
    if (mode === "edit") {
      getListingDetails();
    }
  }, []);

  const getListingDetails = async () => {
    try {
      const result = await db
        .select()
        .from(CarListing)
        .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
        .where(eq(CarListing.id, recordId));

      const resp = Service.FormatResult(result);
      const data = resp[0];
      setCarInfo(data);
      setFormData(data);
      setFeaturesData(data.features);
    } catch (e) {
      console.error(e);
      toast("Failed to fetch listing details");
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (name, value) => {
    setFeaturesData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    // Validate required fields
    let newErrors = {};
    carDetails.carDetails.forEach((item) => {
      if (item.required && !formData[item.name]) {
        newErrors[item.name] = true;
      }
    });

    if (!formData.createdBy) {
      newErrors.createdBy = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = document.querySelector(
        `[data-field="${Object.keys(newErrors)[0]}"]`
      );
      if (firstErrorField)
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("Please fill all required fields");
      setLoader(false);
      return;
    }

    setErrors({});
    toast("Please wait...");

    try {
      if (mode === "edit") {
        await db
          .update(CarListing)
          .set({
            ...formData,
            features: featuresData,
            postedOn: moment().format("DD/MM/YYYY"),
          })
          .where(eq(CarListing.id, recordId));
        setTriggerUploadImages(recordId);
      } else {
        const result = await db
          .insert(CarListing)
          .values({
            ...formData,
            features: featuresData,
            postedOn: moment().format("DD/MM/YYYY"),
          })
          .returning({ id: CarListing.id });

        if (result) setTriggerUploadImages(result[0]?.id);
      }
      setLoader(false);
      navigate("/admin/user-cars");
    } catch (e) {
      console.error(e);
      toast("Failed to save listing");
      setLoader(false);
    }
  };

  return (
    <div>
      <AdminDashboard />
      <div className="bg-white min-h-screen">
        <div className="px-10 md:px-20 my-10">
          <h2 className="font-bold text-4xl text-[#0A2540]">
            {mode === "edit"
              ? "Edit Car Listing [ADMIN]"
              : "Add New Car Listing [ADMIN]"}
          </h2>

          <form
            onSubmit={onSubmit}
            className="p-10 border border-gray-300 rounded-xl mt-10 shadow-sm bg-[#F9FAFB] space-y-6"
          >
            {/* Created By */}
            <div
              data-field="createdBy"
              className={`p-2 rounded-md ${
                errors.createdBy ? "bg-red-50 border border-red-500" : ""
              }`}
            >
              <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                Created By <span className="text-red-500">*</span>
              </label>
              {mode === "edit" ? (
                <input
                  type="text"
                  value={formData.createdBy || ""}
                  disabled
                  className="border p-2 rounded-md w-full bg-gray-200 cursor-not-allowed"
                />
              ) : (
                <select
                  value={formData.createdBy || ""}
                  onChange={(e) =>
                    handleInputChange("createdBy", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select User Email</option>
                  {allUsers.map((email, idx) => (
                    <option key={idx} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Car Details */}
            <div>
              <h2 className="font-semibold text-xl mb-6 text-gray-800">
                Car Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
                {carDetails.carDetails.map((item, idx) => (
                  <div
                    key={idx}
                    data-field={item.name}
                    className={`p-2 rounded-md ${
                      errors[item.name] ? "bg-red-50 border border-red-500" : ""
                    }`}
                  >
                    <label className="text-sm flex gap-2 items-center mb-1 text-gray-700">
                      {item.label}{" "}
                      {item.required && <span className="text-red-500">*</span>}
                    </label>
                    {item.fieldType === "text" ||
                    item.fieldType === "number" ? (
                      <InputField
                        item={item}
                        handleInputChange={handleInputChange}
                        carInfo={carInfo}
                      />
                    ) : item.fieldType === "dropdown" ? (
                      <DropDownField
                        item={item}
                        handleInputChange={handleInputChange}
                        formData={formData}
                      />
                    ) : item.fieldType === "textarea" ? (
                      <TextAreaField
                        item={item}
                        handleInputChange={handleInputChange}
                        carInfo={carInfo}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Features */}
            <div>
              <h2 className="font-semibold text-xl my-6 text-gray-800">
                Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.features.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-center bg-gray-50 p-2 rounded-md border border-gray-200"
                  >
                    <Checkbox
                      onCheckedChange={(value) =>
                        handleFeatureChange(item.name, value)
                      }
                      checked={featuresData?.[item.name]}
                    />
                    <h2 className="text-gray-700">{item.name}</h2>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Extra Fields */}
            {mode === "edit" && (
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-700">Sold Status</label>
                  <input
                    type="text"
                    value={formData.sold || "No"}
                    disabled
                    className="border p-2 rounded-md w-full bg-gray-200 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Posted On</label>
                  <input
                    type="text"
                    value={formData.postedOn || ""}
                    disabled
                    className="border p-2 rounded-md w-full bg-gray-200 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* Car Images */}
            <UploadImages
              triggerUploadImages={triggerUploadImages}
              carInfo={carInfo}
              mode={mode}
              setLoader={(v) => setLoader(v)}
            />

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={loader}
                className="bg-[#0A2540] hover:bg-[#1B365D] text-white font-medium px-6 py-2 rounded-lg shadow-md"
              >
                {!loader ? (
                  "Submit"
                ) : (
                  <BiLoaderAlt className="animate-spin text-white text-lg" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddListing;
