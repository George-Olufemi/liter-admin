import { privateApi, publicApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const startSignUp = async (data: any) => {
  try {
    const response = await publicApi.post("/api/v1/auth/startRegister", data);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error sending otp:", error);
    throw extractErrorMessage(error);
  }
};

export const otpVerification = async (code: any) => {
  try {
    const response = await publicApi.post(
      `/api/v1/auth/verifyToken?token=${code}`
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error verifying OTP:", error);
    throw extractErrorMessage(error);
  }
};

export const createCustomer = async (data: any) => {
  try {
    const response = await publicApi.post(
      "/api/v1/auth/completeRegistration",
      data
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const login = async (data: any) => {
  try {
    const response = await publicApi.post("/api/v1/auth/login", data);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error loggin in:", error);
    throw extractErrorMessage(error);
  }
};

export const forgotPassword = async (data: any) => {
  try {
    const response = await publicApi.post("/api/v1/auth/forgotPassword", data);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const resetPassword = async (data: any) => {
  try {
    const response = await privateApi.post("/api/v1/auth/resetPassword", data);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const editProfile = async (data: any) => {
  try {
    const response = await privateApi.post("/api/v1/auth/updateProfile", data);
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const viewProfile = async () => {
  try {
    const response = await privateApi.get("/api/v1/auth/getProfile");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error FETCHING USER INFO:", error);
    throw extractErrorMessage(error);
  }
};

export const deleteAccount = async () => {
  try {
    const response = await privateApi.get("/api/v1/auth/toggleBlockUser");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};
