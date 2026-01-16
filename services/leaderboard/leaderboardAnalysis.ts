import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const getUserLeaderboard = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/getUserLeaderboard");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getTopPerformingUsers = async () => {
  try {
    const response = await privateApi.get(
      "/api/v1/admin/getTopPerformingUsers"
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getTopMeters = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/getTopMeters");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};
