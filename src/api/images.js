import axios from "axios";
import { getToken } from "../utils/token";
import { DATA_API_BASE } from "./config";

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// Use CORS proxy for dev: https://cors-anywhere.herokuapp.com/
export async function getImages() {
  return axios.get(`${DATA_API_BASE}/images`, {
    headers: authHeaders(),
  });
}

export async function uploadImage(data) {
  // data: FormData with image file
  return axios.post(`${DATA_API_BASE}/images`, data, {
    headers: { ...authHeaders(), "Content-Type": "multipart/form-data" }
  });
}

// Add delete, update, etc. as per API
