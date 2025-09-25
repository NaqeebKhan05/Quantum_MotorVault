import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL_ID;

  const isAdmin = user?.emailAddresses?.some(
    (email) => email.emailAddress === adminEmail
  );

  if (!isSignedIn || !isAdmin) {
    // If not signed in or not admin, redirect
    return <Navigate to="/" replace />;
  }

  // If admin, render the children
  return children;
};

export default AdminRoute;
