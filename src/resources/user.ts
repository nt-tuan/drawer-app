import api from "./api";

export interface User {
  id: number;
  name: string;
  token: string;
  email: string;
  phone: string;
}

export async function login(phone: string) {
  return api.get<User>(`/login?phone=${phone}`);
}
