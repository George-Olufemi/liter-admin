import axios, { AxiosError, AxiosInstance } from "axios";

export const BASE_URL =
  process.env.NEXT_PUBLIC_LITER_BASE_URL ||
  `https://1.11.1.liter:${process.env.NEXT_PUBLIC_LITER_BASE_PORT || 5000}`;

const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

privateApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("auth-session");

      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//* this one i put here is optional: to hanndle expired/invalid tokens globally
privateApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("auth-session");

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export { publicApi, privateApi };
