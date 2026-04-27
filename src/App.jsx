import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import Testimonials from "./pages/Testimonials";
import ScheduleDemo from "./pages/ScheduleDemo";
import ContactUs from "./pages/ContactUs";
import BlogPage from "./pages/Blog";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Module Page */}
        <Route path="/module/:slug" element={<ModulePage />} />

        <Route path="/nurse-training" element={<div>Nurse Training</div>} />
        <Route path="/solutions" element={<div>Solutions</div>} />
        <Route path="/blog" element={<BlogPage/>} />
        <Route path="/news-room" element={<div>News Room</div>} />
        <Route path="/about" element={<div>About</div>} />
        <Route path="/scheduledemo" element={<ScheduleDemo/>} />
        <Route path="/contact" element={<ContactUs/>} />

        {/* Testimonials */}
        <Route path="/testimonials" element={<Testimonials />} />
      </Routes>
    </>
  );
}