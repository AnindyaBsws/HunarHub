import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Entrepreneur from "./pages/Entrepreneur";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/entrepreneur/:id" element={<Entrepreneur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;