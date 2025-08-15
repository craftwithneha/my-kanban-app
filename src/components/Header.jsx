//src/components/Header.jsx
import { useEffect, useState } from "react";
import { Lock, Bell, Search, Settings, LogOut, LogIn, User2 } from "lucide-react";
import { getCurrentUser, logoutUser } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getCurrentUser();
      setUser(loggedInUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-12 py-6 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="text-2xl sm:text-4xl font-bold text-black">
        Kanban
      </div>

      {/* Search bar (hidden on small screens) */}
      <div className="hidden md:block flex-1 max-w-md mx-4 relative">
        <input
          type="text"
          placeholder="Try searching tasks"
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
      </div>

      {/* Right side icons + auth */}
      <div className="flex items-center gap-4">
        {/* Medium+ screen actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-blue-300 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-700 transition-all">
            <Lock className="w-4 h-4" />
            Share
          </button>
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
          <User2 className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>

        {/* Auth buttons */}
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-red-600 hover:underline transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
