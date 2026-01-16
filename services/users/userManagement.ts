import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const getAllUsers = async () => {
  try {
    const response = await privateApi.get(
      "/api/v1/admin/adminViewAllUserRoles"
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error", error);
    throw extractErrorMessage(error);
  }
};

export const getUserByEmail = async (code: any) => {
  try {
    const response = await privateApi.get(
      `/api/v1/admin/viewUserDetails?email=${code}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error", error);
    throw extractErrorMessage(error);
  }
};

export const viewaUserTrasactionAll = async (userId: string) => {
  try {
    const response = await privateApi.get(
      `/api/v1/admin/viewUserTransactions?id=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error", error);
    throw extractErrorMessage(error);
  }
};


export const blockUser = async (code: any) => {
  try {
    const response = await privateApi.post(
      `/api/v1/admin/blockUser?email=${code}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error", error);
    throw extractErrorMessage(error);
  }
};
