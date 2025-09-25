import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./home";
import Contact from "./contact";
import Profile from "./profile";
import About from "./about";
import { ClerkProvider } from "@clerk/clerk-react";
import AddListing from "./add-listing";
import { Toaster } from "./components/ui/sonner";
import SearchByCategory from "./search/[category]";
import SearchByOptions from "./search";
import ListingDetial from "./listing-details/[id]";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./admin/admin";
import UserCars from "./admin/components/UserCars";
import AdminAddListing from "./admin/components/AddNewCar";
import Stats from "./admin/components/Stats";
import AllBookings from "./admin/components/AllBookings";
import AdminRoute from "./admin/components/AdminRoute";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/*",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-listing",
    element: (
      <ProtectedRoute>
        <AddListing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: <SearchByOptions />,
  },
  {
    path: "/search/:category",
    element: <SearchByCategory />,
  },
  {
    path: "/listing-details/:id",
    element: <ListingDetial />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Stats /> },
      { path: "/admin/stats", element: <Stats /> },
      { path: "/admin/users-cars", element: <UserCars /> },
      { path: "/admin/admin-addlisting", element: <AdminAddListing /> },
      { path: "/admin/all-bookings", element: <AllBookings /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
      <Toaster />
    </ClerkProvider>
  </StrictMode>
);
