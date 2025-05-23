import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import _ from "lodash";

export type RequestInterceptor = (
  config: AxiosRequestConfig
) => Promise<AxiosRequestConfig>;

export type ResponseInterceptor = (
  response: AxiosResponse
) => Promise<any> | any;

export type ErrorInterceptor = (error: AxiosError) => Promise<never>;

interface AxiosServiceOptions {
  baseUrl?: string;
  requestInterceptor?: RequestInterceptor;
  responseInterceptor?: ResponseInterceptor;
  errorInterceptor?: ErrorInterceptor;
}

export class AxiosService {
  private instance: AxiosInstance;

  constructor(options: AxiosServiceOptions) {
    this.instance = axios.create({
      baseURL: options?.baseUrl,
    });

    if (options.requestInterceptor) {
      this.instance.interceptors.request.use(async (config) => {
        const newConfig = await options.requestInterceptor!(config);
        return _.merge(config, newConfig);
      });
    }

    if (options.responseInterceptor) {
      this.instance.interceptors.response.use(
        async (response) => options.responseInterceptor!(response),
        options.errorInterceptor || ((error) => Promise.reject(error))
      );
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  handleError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const serverErrorMessage = error.response?.data?.message;
      throw new Error(serverErrorMessage || error.message || defaultMessage);
    } else {
      throw new Error("An unknown error has occurred");
    }
  }
}
