import axios from "axios";

// Note: Using a CORS proxy for local development. Remove the proxy in production.
const API_BASE = `https://corsproxy.io/?http://wannie18-002-site3.btempurl.com/api`;

// POST /api/users/SignIn
// Body: { username: string, password: string }
// Response: { userName, firstName, lastName, email, phoneNumber, token, userId }
export async function login(username, password) {
  const url = `${API_BASE}/users/SignIn`;
  const response = await axios.post(url, { username, password }, {
    headers: { "Content-Type": "application/json" }
  });
  return response;
}

// Add other auth endpoints as needed (register, logout, profile, etc.)
