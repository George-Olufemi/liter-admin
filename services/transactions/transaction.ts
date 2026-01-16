import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const getUserTransactions = async () => {
  try {
    const response = await privateApi.get(
      "/api/v1/admin/adminViewAllTransactions"
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const viewTransactionbyId = async (code: any) => {
  try {
    const response = await privateApi.get(
      `/api/v1/admin/adminViewTransactionById/${code}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};

export const verifyTokenStatus = async (code: any) => {
  try {
    const response = await privateApi.get(
      `/api/v1/admin/verifyTokenStatus?transactionId=${code}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    throw extractErrorMessage(error);
  }
};
