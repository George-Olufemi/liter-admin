import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const getWalletBalance = async () => {
  try {
    const response = await privateApi.get(
      "/api/v1/transaction/getWalletBalance"
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getUserBankingInformation = async () => {
  try {
    const response = await privateApi.get("/api/v1/auth/getUserAccountDetails");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};