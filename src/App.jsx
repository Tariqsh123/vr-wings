import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <Home/>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/nurse-training" element={<div>Nurse Training</div>} />
        <Route path="/solutions" element={<div>Solutions</div>} />
        <Route path="/blog" element={<div>Blog</div>} />
        <Route path="/news-room" element={<div>News Room</div>} />
        <Route path="/about" element={<div>About</div>} />
        <Route path="/contact" element={<div>Contact</div>} />
      </Routes>
    </>
  );
}
