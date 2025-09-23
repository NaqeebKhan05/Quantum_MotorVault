import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
// Configs and Schema
import { CarImages } from "./../../../configs/schema";
import { db } from "./../../../configs";
import { eq } from "drizzle-orm";
import { useNavigate } from "react-router-dom";

function UploadImages({ triggerUploadImages, setLoader, carInfo, mode, onUploadComplete }) {
  const [selectedFileList, setSelectedFileList] = useState([]); // new files
  const [existingCarImageList, setEditCarImageList] = useState([]); // old images from DB
  const navigate = useNavigate();

  // When edit mode loads, populate existing images
  useEffect(() => {
    if (mode === "edit") {
      setEditCarImageList([]); // reset
      carInfo?.images.forEach((image) => {
        setEditCarImageList((prev) => [...prev, image?.imageUrl]);
      });
      console.log("🟦 Existing Images from DB:", carInfo?.images);
    }
  }, [carInfo, mode]);

  // When triggerUploadImages changes (on submit in AddListing)
  useEffect(() => {
    if (triggerUploadImages) {
      UploadImageToServer();
    }
  }, [triggerUploadImages]);

  // Handle selecting new files
  const onFileSelected = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      setSelectedFileList((prev) => [...prev, file]);
    }
    console.log("🟦 Selected New Files:", files);
  };

  // Remove new file before upload
  const onImageRemove = (image) => {
    const result = selectedFileList.filter((item) => item !== image);
    setSelectedFileList(result);
    console.log("🟥 Removed New File:", image);
  };

  // Remove existing image from DB + UI
  const onExistingImageRemove = async (url) => {
    try {
      console.log("🟥 Removing Existing Image:", url);

      // 1. Delete from DB
      await db.delete(CarImages).where(eq(CarImages.imageUrl, url));
      console.log("✅ Deleted from DB:", url);

      // 2. Update local state
      const updated = existingCarImageList.filter((img) => img !== url);
      setEditCarImageList(updated);

    } catch (error) {
      console.error("❌ Error deleting image:", error);
    }
  };

  // Upload new files to Cloudinary + insert into DB
const UploadImageToServer = async () => {
  setLoader(true);

  if (!selectedFileList.length) {
    console.log("⚪ No new images to upload, going to profile");
    setLoader(false);
    navigate("/profile"); // if nothing to upload
    return;
  }

  try {
    const uploadPromises = selectedFileList.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "car_marketplace_unsigned");

      console.log("🟦 Uploading file to Cloudinary:", file.name);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dtxm7y4sz/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("📦 Cloudinary Upload Response:", data);

      if (!data.secure_url) {
        console.error("❌ Upload failed, no URL returned", data);
        return;
      }

      const insertResult = await db.insert(CarImages).values({
        imageUrl: data.secure_url,
        carListingId: Number(triggerUploadImages),
      });

      console.log("✅ Inserted into DB:", insertResult);
    });

    // ✅ wait for all uploads to complete
    await Promise.all(uploadPromises);
  
    console.log("✅ All uploads finished");
     if (onUploadComplete) {
       onUploadComplete();
     }
       navigate("/profile");
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
  } finally {
    setLoader(false);
  }
};

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload Car Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">

        {/* Existing Images (Edit Mode) */}
        {mode === "edit" &&
          existingCarImageList.map((image, index) => (
            <div key={index} className="relative">
              <IoMdCloseCircle
                className="absolute m-2 text-lg text-white hover:scale-150 cursor-pointer"
                onClick={() => onExistingImageRemove(image)}
              />
              <img
                src={image}
                className="w-full h-[80px] object-cover rounded-xl"
                alt="Existing Car"
              />
            </div>
          ))}

        {/* New Images (Not yet uploaded) */}
        {selectedFileList.map((image, index) => (
          <div key={index} className="relative">
            <IoMdCloseCircle
              className="absolute m-2 text-lg text-white hover:scale-150 cursor-pointer"
              onClick={() => onImageRemove(image)}
            />
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-[80px] object-cover rounded-xl"
              alt="New Car"
            />
          </div>
        ))}

        {/* Input Button */}
        <label htmlFor="upload-images">
          <div className="rounded-xl border-dotted border-primary bg-blue-100 p-10 cursor-pointer hover:shadow-md">
            <h2 className="text-xl text-center text-primary hover:scale-300">+</h2>
          </div>
        </label>
        <input
          type="file"
          multiple={true}
          id="upload-images"
          className="opacity-0"
          onChange={onFileSelected}
        />
      </div>
    </div>
  );
}

export default UploadImages;
