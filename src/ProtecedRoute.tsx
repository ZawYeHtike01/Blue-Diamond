
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useApp } from "./app/App";
import { auth } from "./firebase/firebase";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const {user,setUser}=useApp();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-blue-400">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-sm text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
