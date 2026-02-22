import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.2:3000/api"; // Your machine's LAN IP

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = await AsyncStorage.getItem("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log(`[API] ${options.method || "GET"} ${url}`);

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (networkError: any) {
    console.error(`[API] Network error for ${url}:`, networkError.message);
    throw new Error(`Network error: Could not connect to server`);
  }

  if (response.status === 401) {
    await AsyncStorage.removeItem("auth_token");
  }

  const data = await response.json();

  if (!response.ok) {
    console.error(`[API] Error ${response.status}:`, data);
    throw new Error(data?.error?.message || "Request failed");
  }

  return data;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: any) =>
    request<T>(url, { method: "POST", body }),
  put: <T>(url: string, body?: any) => request<T>(url, { method: "PUT", body }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
