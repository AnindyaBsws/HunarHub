import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";

// PROFILE IMPORT 
import Profile from "./pages/profile/Profile";

import Entrepreneur from "./pages/Entrepreneur";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/about";
import Services from "./pages/Services";
import CreateService from "./pages/CreateService";
import Requests from "./pages/Requests";
import MyRequests from "./pages/MyRequests";
import BecomeSeller from "./pages/BecomeSeller";

// ⚠️ OPTIONAL (can remove later)
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/entrepreneur/:id" element={<Entrepreneur />} />
        <Route path="/about" element={<About />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/become-seller" element={<BecomeSeller />} />

        {/* Services */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/create" element={<CreateService />} />

        {/* Requests */}
        <Route path="/requests" element={<Requests />} />
        <Route path="/my-requests" element={<MyRequests />} />

        {/* ⚠️ Temporary (can delete later) */}
        <Route path="/profile/edit" element={<EditProfile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;