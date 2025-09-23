import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import MyListing from "./components/MyListing";
import Inbox from "./components/Inbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyBooking from "./components/MyBooking";
import Dashboard from "./components/Dashboard";
import ManageBookings from "./components/ManageBookings";
import { useLocation, useNavigate } from "react-router-dom";

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("dashboard");

  // Update tabValue based on URL path
  useEffect(() => {
    const path = location.pathname.split("/")[2]; // e.g., "/profile/my-booking" -> "my-booking"
    if (path) {
      setTabValue(path);
    } else {
      navigate("/profile/dashboard", { replace: true });
    }
  }, [location.pathname]);

  // Handle tab change and update the route
  const handleTabChange = (value) => {
    setTabValue(value);
    navigate(`/profile/${value}`);
  };

  return (
    <div>
      <div className="p-3">
        <Header />
      </div>
      <div className="px-10 md:px-10 my-5">
        <Tabs
          value={tabValue}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full flex justify-center">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="my-listing">My Cars</TabsTrigger>
            <TabsTrigger value="my-booking">My Bookings</TabsTrigger>
            <TabsTrigger value="manage-bookings">Manage Bookings</TabsTrigger>
            <TabsTrigger value="inbox">My Inbox</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="my-listing">
            {" "}
            <MyListing />{" "}
          </TabsContent>
          <TabsContent value="my-booking">
            {" "}
            <MyBooking />{" "}
          </TabsContent>
          <TabsContent value="manage-bookings">
            <ManageBookings />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
