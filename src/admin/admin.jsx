// src/admin/AdminDashboard.jsx

import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"; // shadcn utility for conditional classes
import {
  LayoutDashboard,
  Users,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { LuNotepadText } from "react-icons/lu";

function AdminDashboard() {
  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    {
      key: "1",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      to: "/admin/stats",
    },
    {
      key: "2",
      label: "Users Listed Cars",
      icon: <Users className="w-5 h-5" />,
      to: "/admin/users-cars",
    },
    {
      key: "3",
      label: "All Bookings",
      icon: <LuNotepadText className="w-5 h-5" />,
      to: "/admin/all-bookings",
    },
  ];

  const renderMenu = (items) =>
    items.map((item) => {
      const isActive = location.pathname === item.to;

      if (item.submenu) {
        const isOpen = openMenus[item.key] ?? false;
        return (
          <div key={item.key}>
            <button
              onClick={() => toggleMenu(item.key)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </div>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {renderMenu(item.submenu)}
              </div>
            )}
          </div>
        );
      }

      return (
        <Link
          key={item.key}
          to={item.to}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm rounded-md",
            isActive
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
          onClick={() => setMobileOpen(false)}
        >
          {item.icon}
          {item.label}
        </Link>
      );
    });

  return (
    <div className="flex">
      {/* Sidebar Desktop */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md hidden md:flex flex-col">
        {/* Logo */}
        <Link to={"/"}>
          <div className="flex items-center gap-2 p-4 border-b">
            <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
            <h2 className="font-bold text-lg leading-tight">
              Quantum
              <br />
              MotorVault
            </h2>
          </div>
        </Link>
        <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
        <nav className="p-2 space-y-1">{renderMenu(menuItems)}</nav>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow w-full fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <h2 className="font-bold text-lg">Quantum MotorVault</h2>
        </div>
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar content */}
          <div className="w-64 bg-white h-full shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
                <h2 className="font-bold text-lg">Admin Panel</h2>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-2 space-y-1 overflow-y-auto">
              {renderMenu(menuItems)}
            </nav>
          </div>

          {/* Overlay */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 mt-14 md:mt-0 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
