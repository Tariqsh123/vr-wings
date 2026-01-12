import { useRef, useState } from "react";
import { FaRegEye, FaCube, FaRobot, FaGlobe, FaVrCardboard, FaMicrochip, FaBrain } from "react-icons/fa";

const services = [
  ["ar", "AR — Augmented Reality", <FaRegEye size={40} className="text-purple-600 transition-colors duration-300" />, "Augmented Reality solutions to overlay digital content in real-world environments, boosting learning and engagement."],
  ["vr", "VR — Virtual Reality", <FaVrCardboard size={40} className="text-purple-600 transition-colors duration-300" />, "Immersive Virtual Reality experiences for training, simulation, and entertainment."],
  ["mr", "MR — Mixed Reality", <FaCube size={40} className="text-purple-600 transition-colors duration-300" />, "Mixed Reality applications combining AR and VR for interactive, collaborative environments."],
  ["xr", "XR — Extended Reality", <FaGlobe size={40} className="text-purple-600 transition-colors duration-300" />, "Extended Reality solutions covering AR, VR, and MR for futuristic experiences."],
  ["vr360", "VR360 — 360° Virtual Reality", <FaCube size={40} className="text-purple-600 transition-colors duration-300" />, "360° VR experiences for full immersion in virtual spaces, ideal for training and virtual tours."],
  ["vr-simulation", "VR Simulation", <FaRobot size={40} className="text-purple-600 transition-colors duration-300" />, "High-fidelity VR simulations for safe and effective training across industries."],
  ["copilot", "AI Copilot", <FaBrain size={40} className="text-purple-600 transition-colors duration-300" />, "AI-powered copilot systems integrated into VR/AR for intelligent assistance and automation."],
];

export default function Home_Services() {
  return (
    <section className="relative w-full py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Our Services
          </h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg sm:text-xl max-w-[800px] mx-auto">
            We provide cutting-edge AR, VR, XR, VR360, simulation, and AI copilot solutions to deliver immersive learning and business growth. Explore the interactive cards below to see how our services can transform your experience.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
          {services.map(([key, name, icon, desc]) => (
            <VRCard key={key} name={name} icon={icon} link={`#${key}`} description={desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VRCard({ name, icon, link, description }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;
    setTilt({ rotateX, rotateY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <a
      href={link}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white rounded-[30px] p-8 cursor-pointer overflow-hidden transform-gpu transition-all duration-500 w-[95%] max-w-[350px] h-[420px] flex flex-col justify-between items-center group shadow-lg hover:shadow-2xl"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
      }}
    >
      {/* Neon Gradient Border */}
      <div className="absolute inset-0 rounded-[30px] border-2 border-gray-200 group-hover:border-purple-500 transition-all duration-500 pointer-events-none"></div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-purple-600 rounded-[30px] opacity-0 group-hover:opacity-100 transition-all duration-500 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between items-center text-center">
        <div className="mb-6 flex flex-col items-center transition-colors duration-500 group-hover:text-white">
          <div className="mb-4">{icon}</div>
          <h3 className="text-2xl font-semibold">{name}</h3>
        </div>
        <p className="text-gray-600 mb-6 px-2 text-center transition-colors duration-500 group-hover:text-white">
          {description}
        </p>
        <button className="mt-auto relative px-6 py-3 bg-purple-600 text-white font-semibold rounded-[30px] shadow-lg overflow-hidden group-hover:bg-white group-hover:text-purple-600 w-full max-w-[200px]">
          <span className="absolute left-0 top-0 w-full h-full bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
          <span className="relative z-10">Learn More</span>
        </button>
      </div>
    </a>
  );
}
