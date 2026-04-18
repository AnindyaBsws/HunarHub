import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Entrepreneur from "./pages/Entrepreneur";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About  from "./pages/about";
import Services from "./pages/Services";
import CreateService from "./pages/CreateService";
import Requests from "./pages/Requests";
import MyRequests from "./pages/MyRequests";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/entrepreneur/:id" element={<Entrepreneur />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/create" element={<CreateService />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/my-requests" element={<MyRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;