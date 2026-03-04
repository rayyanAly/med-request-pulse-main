import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  // First check Redux store, then localStorage
  const { user } = useSelector((state: any) => state.login);
  
  // Get user from localStorage if not in Redux
  let currentUser = user;
  if (!currentUser) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch {
        // Invalid user data
      }
    }
  }
  
  // Only admin or Super Admin can access admin routes
  const isAdmin = currentUser?.user_type === "admin" || currentUser?.user_type === "Super Admin";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
