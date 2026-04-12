import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ApprovedTeamsPage from "./pages/ApprovedTeamsPage";
import RegistrationInstructionsPage from "./pages/RegistrationInstructionsPage";
import TeamRegistrationPage from "./pages/TeamRegistrationPage";
import TournamentDetailsPage from "./pages/TournamentDetailsPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<TournamentDetailsPage />} />
        <Route path="/instructions" element={<RegistrationInstructionsPage />} />
        <Route path="/register" element={<TeamRegistrationPage />} />
        <Route path="/teams" element={<ApprovedTeamsPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
