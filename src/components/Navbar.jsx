import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.webp";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative font-medium text-white md:text-black transition hover:text-[#9000ff]
     after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
     after:bg-[#9000ff] after:transition-all
     hover:after:w-full
     ${isActive ? "text-[#9000ff] after:w-full" : ""}`;

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full flex justify-center mt-4 px-4 z-[29999]">
        <nav className="w-full max-w-[1200px] bg-white rounded-[40px] shadow-xl px-8 py-6 flex items-center justify-between">

          <NavLink to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </NavLink>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-8">

            {/* SERVICES */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="font-medium text-black hover:text-[#9000ff] flex items-center gap-2"
              >
                Our Services
                <span
                  className={`transition-transform duration-300 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[2]">
                  {[
                    ["ar", "AR — Augmented Reality"],
                    ["vr", "VR — Virtual Reality"],
                    ["mr", "MR — Mixed Reality"],
                    ["xr", "XR — Extended Reality"],
                    ["vr360", "VR360 — 360° Virtual Reality"],
                    ["vr-simulation", "VR Simulation"],
                    ["copilot", "Copilot — AI Assistant"],
                  ].map(([path, label]) => (
                    <NavLink
                      key={path}
                      to={`/services/${path}`}
                      className="block px-4 py-3 rounded-xl hover:bg-[#9000ff]/10"
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
            <NavLink to="/tools-technologies" className={navLinkClass}>Tools & Technologies</NavLink>
            <NavLink to="/blogs" className={navLinkClass}>Blogs</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>

            <NavLink
              to="/contact"
              className="px-7 py-2 rounded-[20px] bg-[#9000ff] text-white font-medium"
            >
              Contact Us
            </NavLink>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-black text-2xl"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[299999] transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } bg-[#9000ff]`}
      >
        <div className="h-screen overflow-y-auto px-6 py-8 text-white flex flex-col gap-6">

          {/* CLOSE */}
          <button
            className="self-end text-4xl mb-4"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          {/* SERVICES */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[28px] font-semibold">Our Services</h3>

            {[
              ["ar", "AR — Augmented Reality"],
              ["vr", "VR — Virtual Reality"],
              ["mr", "MR — Mixed Reality"],
              ["xr", "XR — Extended Reality"],
              ["vr360", "VR360 — 360° Virtual Reality"],
              ["vr-simulation", "VR Simulation"],
              ["copilot", "AI Copilot"],
            ].map(([path, label]) => (
              <NavLink
                key={path}
                to={`/services/${path}`}
                onClick={() => setMenuOpen(false)}
                className="text-[22px] opacity-90"
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* OTHER LINKS */}
          {[
            ["/pricing", "Pricing"],
            ["/tools-technologies", "Tools & Technologies"],
            ["/blogs", "Blogs"],
            ["/about", "About"],
          ].map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="text-[26px]"
            >
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mb-6 px-6 py-2 bg-[#000] rounded-[20px] text-center text-[24px]"
          >
            Contact Us
          </NavLink>

        </div>
      </div>
    </>
  );
}
