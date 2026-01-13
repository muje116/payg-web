import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import SermonsPage from "../pages/SermonsPage";
import SermonUploadPage from "../pages/SermonUploadPage";
import ThemesPage from "../pages/ThemesPage";
import ThemeUploadPage from "../pages/ThemeUploadPage";
import ImagesPage from "../pages/ImagesPage";
import ImageUploadPage from "../pages/ImageUploadPage";
import { AuthContext } from "../contexts/AuthContext";
import MainLayout from "../components/MainLayout";

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/sermons" element={<PrivateRoute><SermonsPage /></PrivateRoute>} />
        <Route path="/sermons/upload" element={<PrivateRoute><SermonUploadPage /></PrivateRoute>} />
        <Route path="/themes" element={<PrivateRoute><ThemesPage /></PrivateRoute>} />
        <Route path="/themes/upload" element={<PrivateRoute><ThemeUploadPage /></PrivateRoute>} />
        <Route path="/images" element={<PrivateRoute><ImagesPage /></PrivateRoute>} />
        <Route path="/images/upload" element={<PrivateRoute><ImageUploadPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
