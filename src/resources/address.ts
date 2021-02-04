import api from "./api";

export const NEW_ADDRESS_ID = -1;

export interface AddressPart {
  id: number;
  name: string;
}

export interface Address {
  id?: number;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  street?: string;
  phone?: string;

  ward?: string
  district?: string;
  province?: string;
  recipient?: string;
}

export interface LoadAddressResponse {
  wards: AddressPart[],
  provinces: AddressPart[],
  districts: AddressPart[],
}

export async function loadAddressSuggestion(token: string, address: Address) {
  const query = [
    address.provinceId && `province_id=${address.provinceId}`,
    address.districtId && `district_id=${address.districtId}`,
    address.wardId && `ward_id=${address.wardId}`
  ].join("&");
  return api.get<LoadAddressResponse>(`/address/suggest?${query}`, token);
}

export async function loadAllAddresses(token: string) {
  return api.get<Address[]>("/address/all", token);
}

export interface CreateAddressRequestBody {
  phone: string;
  street: string;
  ward_id: number;
  recipient: string;
  description: string;
}

export async function createAddress(token: string, body: CreateAddressRequestBody) {
  return api.post<Address>("/address/create", token, JSON.stringify(body));
}

export async function deleteAddress(token: string, id: number) {
  return api.delete<Address>(`/address/${id}`, token);
}
