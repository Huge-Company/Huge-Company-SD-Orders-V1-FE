import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import NewReceipt from "../pages/Functions/New/Receipt/NewReceipt";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* Employee workspace */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* Restricted functions */}
      <Route
        path="/func/new/receipt"
        element={<NewReceipt />}
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}