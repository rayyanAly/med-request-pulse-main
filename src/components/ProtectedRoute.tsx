import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSelector((state: any) => state.login);

  // Check if user is in localStorage to avoid redirect on refresh
  const storedUser = localStorage.getItem('user');
  const hasStoredUser = storedUser && (() => {
    try {
      JSON.parse(storedUser);
      return true;
    } catch {
      return false;
    }
  })();

  if (loading && !hasStoredUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && !hasStoredUser) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
