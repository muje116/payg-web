import axios from "axios";
import { getToken } from "../utils/token";
const API_BASE = "https://corsproxy.io/?http://wannie18-002-site2.btempurl.com/api";

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// POST /api/SermonImage/sermonImage
export async function uploadSermonImage(sermonId, imageFile) {
  const formData = new FormData();
  // Append the file with the key 'image' as expected by the API
  formData.append('image', imageFile);
  
  // Include SermonId as a query parameter in the URL
  return axios.post(`${API_BASE}/SermonImage/sermonImage?SermonId=${sermonId}`, formData, { 
    headers: { 
      ...authHeaders(),
      'accept': 'text/plain',
      'Content-Type': 'multipart/form-data'
    } 
  });
}

// GET /api/Sermons/GetSermons
export async function getSermons() {
  return axios.get(`${API_BASE}/Sermons/GetSermons`, { headers: authHeaders() });
}

// GET /api/Sermons/GetSermonsPerTheme/{themeId}
export async function getSermonsPerTheme(themeId) {
  return axios.get(`${API_BASE}/Sermons/GetSermonsPerTheme/${themeId}`, { headers: authHeaders() });
}

// GET /api/Sermons/GetSermonUri/sermonTitle
export async function getSermonUri(sermonTitle) {
  return axios.get(`${API_BASE}/Sermons/GetSermonUri/${encodeURIComponent(sermonTitle)}`, { headers: authHeaders() });
}

// GET /api/Sermons/GetRecentSermons
export async function getRecentSermons() {
  return axios.get(`${API_BASE}/Sermons/GetRecentSermons`, { headers: authHeaders() });
}

// POST /api/Sermons/PostSermon
export async function postSermon(sermon) {
  return axios.post(`${API_BASE}/Sermons/PostSermon`, sermon, { headers: authHeaders() });
}

// PUT /api/Sermons/PutSermon/{id}
export async function putSermon(id, sermon) {
  return axios.put(`${API_BASE}/Sermons/PutSermon/${id}`, sermon, { headers: authHeaders() });
}

// DELETE /api/Sermons/DeleteSermon/{id}
export async function deleteSermon(id) {
  return axios.delete(`${API_BASE}/Sermons/DeleteSermon/${id}`, { headers: authHeaders() });
}

