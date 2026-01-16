import { privateApi } from "../index";
import { extractErrorMessage } from "@/utils/errorHandler";

export const getSystemHealthSummary = async () => {
  try {
    const response = await privateApi.get(
      "/api/v1/admin/getSystemHealthSummary"
    );
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getUserStatistics = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/user/stats");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getRetentionStats = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/getRetentionStats");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getVendingStats = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/vending/stats");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getWeeklyVendingStats = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/vending/weekly");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getMonthlyVendingStats = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/vending/monthly");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getYearlyVendingStats = async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/vending/yearly");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};

export const getEnergyGraphicalAnalysis= async () => {
  try {
    const response = await privateApi.get("/api/v1/admin/vending/graph");
    // console.log("API response:", response.data);
    return response?.data;
  } catch (error) {
    console.log("Error:", error);
    throw extractErrorMessage(error);
  }
};
