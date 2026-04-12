import { Navigate, useLocation } from "react-router-dom";

import { getStoredAdminToken } from "../../hooks/useAdminAuth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getStoredAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
