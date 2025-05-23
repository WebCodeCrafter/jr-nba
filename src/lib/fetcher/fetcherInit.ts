import { AxiosError } from "axios";
import { AxiosService } from "./fetcherAction";

export const axiosService = new AxiosService({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  requestInterceptor: async (config) => {
    const hasCustomAuthorization =
      config.headers && config.headers.Authorization;

    config.headers = {
      ...(config.headers || {}),
      ...(!hasCustomAuthorization
        ? { Authorization: "`Bearer ${token}`" }
        : {}),
    };

    return config;
  },
  responseInterceptor: async (response) => {
    return {
      data: response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
    };
  },
  errorInterceptor: async (error: AxiosError) => {
    if (error.response) {
      console.log("Error:", error.response.status, error.config?.url);

      if (error.response.status === 401) {
        console.log("Error 401 - Redirecting to login");
      }
    } else {
      console.log("Error without response:", error.message);
    }

    return Promise.reject({
      data: error.response?.data,
      status: error.response?.status,
      ok: false,
      message: error.message,
    });
  },
});
