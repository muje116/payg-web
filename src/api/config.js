// Centralized API configuration

const IS_DEV = import.meta.env.DEV;

// Login API (Site 3 - HTTP)
// In dev: proxy /api/auth -> http://wannie18-002-site3.btempurl.com/api
// In prod: Using CORS proxy because of Mixed Content (HTTPS -> HTTP)
export const AUTH_API_BASE = IS_DEV
  ? "/api/auth"
  : "https://corsproxy.io/?http://wannie18-002-site3.btempurl.com/api";

// Data API (Site 2 - HTTP)
// In dev: proxy /api/data -> http://wannie18-002-site2.btempurl.com/api
// In prod: Using CORS proxy because of Mixed Content (HTTPS -> HTTP)
export const DATA_API_BASE = IS_DEV
  ? "/api/data"
  : "https://corsproxy.io/?http://wannie18-002-site2.btempurl.com/api";
