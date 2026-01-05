import axios from "axios";
import { getToken } from "../utils/token";

const API_BASE = "https://corsproxy.io/?http://wannie18-002-site2.btempurl.com/api";

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// GET /api/Themes
export async function getThemes() {
  return axios.get(`${API_BASE}/Themes`, { headers: authHeaders() });
}

// GET /api/Themes/{id}
export async function getTheme(id) {
  return axios.get(`${API_BASE}/Themes/${id}`, { headers: authHeaders() });
}

// POST /api/Themes
export async function postTheme(theme) {
  return axios.post(`${API_BASE}/Themes`, theme, { headers: authHeaders() });
}

// PUT /api/Themes/{id}
export async function putTheme(id, theme) {
  return axios.put(`${API_BASE}/Themes/${id}`, theme, { headers: authHeaders() });
}

// DELETE /api/Themes/{id}
export async function deleteTheme(id) {
  return axios.delete(`${API_BASE}/Themes/${id}`, { headers: authHeaders() });
}
