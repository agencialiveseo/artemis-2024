import { axiosInstance } from "@/services/apiService";

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export async function loginUser(
  credentials: Credentials
): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/account/login",
      credentials
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao realizar login");
  }
}

export async function registerUser(
  credentials: Credentials
): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/account/register",
      credentials
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao realizar login");
  }
}