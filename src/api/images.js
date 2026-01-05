import axios from "axios";
import { getToken } from "../utils/token";
const API_BASE = "https://corsproxy.io/?http://wannie18-002-site2.btempurl.com/api";

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// Use CORS proxy for dev: https://cors-anywhere.herokuapp.com/
export async function getImages() {
  return axios.get(`${API_BASE}/images`, {
    headers: authHeaders(),
  });
}

export async function uploadImage(data) {
  // data: FormData with image file
  return axios.post(`${API_BASE}/images`, data, {
    headers: { ...authHeaders(), "Content-Type": "multipart/form-data" }
  });
}

// Add delete, update, etc. as per API
