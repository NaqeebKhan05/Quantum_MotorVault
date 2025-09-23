// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    // Optionally, you can return a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    // If not signed in, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If signed in, render the children components
  return children;
}
