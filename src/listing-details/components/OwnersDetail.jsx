import { Button } from "@/components/ui/button";
import Service from "@/shared/Service";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function OwnersDetail({ carDetail }) {
  const { user } = useUser();
  const navigation = useNavigate();

  const OnMessageOwnerButtonClick = async () => {
    if (!user) {
      alert("Please Log In to message.");
      return;
    }

    // Prevent messaging self
    if (user.primaryEmailAddress.emailAddress === carDetail?.createdBy) {
      alert("You cannot message yourself");
      return;
    }

    const userId = user.primaryEmailAddress.emailAddress.split("@")[0];
    const ownerUserId = carDetail?.createdBy.split("@")[0];

    try {
      await Service.CreateSendBirdUser(userId, user?.fullName, user?.imageUrl);
    } catch (e) {}

    try {
      await Service.CreateSendBirdUser(
        ownerUserId,
        carDetail?.userName,
        carDetail?.userImageUrl
      );
    } catch (e) {}

    try {
      await Service.CreateSendBirdChannel(
        [userId, ownerUserId],
        carDetail?.listingTitle
      ).then(() => {
        navigation("/profile/inbox");
      });
    } catch (e) {}
  };

  return (
    <div className="p-6 border rounded-xl shadow-md max-w-2xl mx-auto mb-7 mr-10">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Price Details */}
        <div className="md:col-span-1 border-r border-gray-300 pr-4">
          <h2 className="font-medium text-2xl my-3">
            Purchace this car, Sales Price:
          </h2>
          <h2 className="font-bold text-4xl ">${carDetail?.sellingPrice}</h2>
        </div>

        {/* Owner Details */}
        <div className="md:col-span-2 pl-5">
          <h2 className="font-medium text-2xl my-3">Owner / Dealer</h2>
          <img
            src={carDetail?.userImageUrl}
            alt="Owner"
            className="w-[70px] h-[70px] rounded-full object-cover"
          />
          <h2 className="mt-2 font-bold text-xl">{carDetail?.userName}</h2>
          <h2 className="mt-2 text-gray-500">{carDetail?.createdBy}</h2>
        </div>
      </div>

      {/* Button */}
      <Button onClick={OnMessageOwnerButtonClick} className="w-full mt-6">
        <MdOutlineLocalOffer className="text-lg mr-2" />
        {user?.primaryEmailAddress?.emailAddress === carDetail?.createdBy
          ? "Owner cannot self message"
          : user
          ? "Message Owner"
          : "Please Log In to message."}
      </Button>
    </div>
  );
}

export default OwnersDetail;
