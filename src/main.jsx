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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
      <Toaster />
    </ClerkProvider>
  </StrictMode>
);
