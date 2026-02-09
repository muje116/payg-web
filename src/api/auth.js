import axios from "axios";
import { AUTH_API_BASE } from "./config";

// POST /api/users/SignIn
// Body: { username: string, password: string }
// Response: { userName, firstName, lastName, email, phoneNumber, token, userId }
export async function login(username, password) {
  const url = `${AUTH_API_BASE}/users/SignIn`;
  const response = await axios.post(url, { username, password }, {
    headers: { "Content-Type": "application/json" }
  });
  return response;
}

// Add other auth endpoints as needed (register, logout, profile, etc.)
