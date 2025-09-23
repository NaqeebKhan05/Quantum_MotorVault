import axios from "axios";

const SendBirdApplicationId = import.meta.env.VITE_SENDBIRD_APP_ID;
const SendBirdApiToken = import.meta.env.VITE_SENDBIRD_API_TOKEN;

/**
 * FormatResult
 * Groups rows (car + image) into unique car objects with all their images
 */
const FormatResult = (resp) => {
  const result = {}; // object map: { carId: { car, images } }

  resp.forEach((item) => {
    const listingId = item.carListing?.id;
    if (!listingId) return;

    // If car doesn't exist in map, create it
    if (!result[listingId]) {
      result[listingId] = {
        car: item.carListing,
        images: [],
      };
    }

    // Push images (if exists)
    if (item.carImages) {
      result[listingId].images.push(item.carImages);
    }
  });

  // Convert object to array
  const finalResult = Object.values(result).map((item) => ({
    ...item.car,
    images: item.images,
  }));

  console.log("Formatted unique cars:", finalResult.length, finalResult);

  return finalResult;
};

/**
 * CreateSendBirdUser
 * Registers a user in SendBird
 */
const CreateSendBirdUser = (userId, nickName, profileUrl) => {
  return axios.post(
    `https://api-${SendBirdApplicationId}.sendbird.com/v3/users`,
    {
      user_id: userId,
      nickname: nickName,
      profile_url: profileUrl,
      issue_access_token: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": SendBirdApiToken,
      },
    }
  );
};

/**
 * CreateSendBirdChannel
 * Creates a group channel for given users
 */
const CreateSendBirdChannel = (users, title) => {
  return axios.post(
    `https://api-${SendBirdApplicationId}.sendbird.com/v3/group_channels`,
    {
      user_ids: users,
      is_distinct: true, // fixed typo
      name: title,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": SendBirdApiToken,
      },
    }
  );
};

export default {
  FormatResult,
  CreateSendBirdUser,
  CreateSendBirdChannel,
};
