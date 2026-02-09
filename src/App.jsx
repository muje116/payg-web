import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <PlayerProvider>
          <AppRoutes />
        </PlayerProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
