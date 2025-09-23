import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import carDetails from "./../shared/carDetails.json";
import InputField from "./components/InputField";
import DropDownField from "@/add-listing/components/DropDownField";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import features from "./../shared/features.json";
import { Button } from "@/components/ui/button";
import { CarImages, CarListing } from "./../../configs/schema";
import { db } from "./../../configs";
import TextAreaField from "./components/TextAreaField";
import IconField from "./components/IconField";
import UploadImages from "./components/UploadImages";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import moment from "moment";
import { eq } from "drizzle-orm";
import Service from "@/shared/Service";

function AddListing() {
  const [formData, setFormData] = useState({});
  const [featuresData, setFeaturesData] = useState({});
  const [triggerUploadImages, setTriggerUploadImages] = useState();
  const [searchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const [carInfo, setCarInfo] = useState();
  const navigate = useNavigate();
  const { user } = useUser();
  const mode = searchParams.get("mode");
  const recordId = searchParams.get("id");
  // Catch Empty Required Fields
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode == "edit") {
      GetListingDetails();
    }
  }, []);

  const GetListingDetails = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.id, recordId));

    const resp = Service.FormatResult(result);
    setCarInfo(resp[0]);
    setFormData(resp[0]);
    setFeaturesData(resp[0].features);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFeatureChange = (name, value) => {
    setFeaturesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    let newErrors = {};
    carDetails.carDetails.forEach((item) => {
      if (item.required && !formData[item.name]) {
        newErrors[item.name] = true;
      }
    });

    // If errors exist, stop submission and scroll
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Scroll to first missing field
      const firstErrorField = document.querySelector(
        `[data-field="${Object.keys(newErrors)[0]}"]`
      );
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      toast("Please fill all required fields");
      setLoader(false);
      return;
    }

    // ✅ Clear errors before saving
    setErrors({});
    toast("Please Wait....");

    // Your existing DB insert/update logic here
    if (mode == "edit") {
      const result = await db
        .update(CarListing)
        .set({
          ...formData,
          features: featuresData,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          userImageUrl: user?.imageUrl,
          postedOn: moment().format("DD/MM/YYYY"),
        })
        .where(eq(CarListing.id, recordId))
        .returning({ id: CarListing.id });
      setTriggerUploadImages(recordId);
    } else {
      try {
        const result = await db
          .insert(CarListing)
          .values({
            ...formData,
            features: featuresData,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName,
            userImageUrl: user?.imageUrl,
            postedOn: moment().format("DD/MM/YYYY"),
          })
          .returning({ id: CarListing.id });

        if (result) {
          setLoader(false);
          setTriggerUploadImages(result[0]?.id);
        }
      } catch (e) {
        setLoader(false);
        toast("Please fill all required Fields");
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="px-10 md:px-20 my-10">
        <h2 className="font-bold text-4xl text-[#0A2540]">Add New Listing</h2>
        <form
          className="p-10 border border-gray-300 rounded-xl mt-10 shadow-sm bg-[#F9FAFB]"
          onSubmit={onSubmit}
        >
          {/* Car Details */}
          <div>
            <h2 className="font-semibold text-xl mb-6 text-gray-800">
              Car Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
              {carDetails.carDetails.map((item, index) => (
                <div
                  key={index}
                  data-field={item.name} // for scroll targeting
                  className={`p-2 rounded-md ${
                    errors[item.name] ? "bg-red-50 border border-red-500" : ""
                  }`}
                >
                  <label className="text-sm flex gap-2 items-center mb-1 text-gray-700">
                    <IconField icon={item?.icon} />
                    {item?.label}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.fieldType == "text" || item.fieldType == "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : item.fieldType == "dropdown" ? (
                    <DropDownField
                      item={item}
                      handleInputChange={handleInputChange}
                      formData={formData}
                    />
                  ) : item.fieldType == "textarea" ? (
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

          {/* Features List */}
          <div>
            <h2 className="font-semibold text-xl my-6 text-gray-800">
              Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.features.map((item, index) => (
                <div
                  key={index}
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

          {/* Car Images */}
          <UploadImages
            triggerUploadImages={triggerUploadImages}
            carInfo={carInfo}
            mode={mode}
            setLoader={(v) => {
              setLoader(v);
              navigate("/profile");
            }}
          />

          {/* Submit Button */}
          <div className="mt-10 flex justify-end">
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
  );
}

export default AddListing;
