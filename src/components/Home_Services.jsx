import { useRef, useState } from "react";
import { FaRegEye, FaCube, FaRobot, FaGlobe, FaVrCardboard, FaBrain, FaArrowRight } from "react-icons/fa";

const services = [
  ["ar", "AR — Augmented Reality", <FaRegEye size={40} />, "Augmented Reality solutions that overlay digital information onto the real world, enhancing perception and interaction."],
  ["vr", "VR — Virtual Reality", <FaVrCardboard size={40} />, "Immersive Virtual Reality experiences that transport users to entirely new, computer-generated environments."],
  ["mr", "MR — Mixed Reality", <FaCube size={40} />, "Mixed Reality applications blending physical and digital worlds, enabling real-time interaction between both."],
  ["xr", "XR — Extended Reality", <FaGlobe size={40} />, "Extended Reality solutions encompassing the full spectrum of immersive technologies, from AR to VR."],
  ["vr360", "VR360 — 360° Virtual Reality", <FaCube size={40} />, "360° VR experiences offering panoramic immersion, perfect for virtual tours and training simulations."],
  ["vr-simulation", "VR Simulation", <FaRobot size={40} />, "High-fidelity VR simulations for realistic training, prototyping, and complex scenario replication."],
  ["copilot", "AI Copilot", <FaBrain size={40} />, "AI-powered copilot systems that assist, automate, and enhance decision-making in real-time applications."],
];

export default function Home_Services() {
  return (
    <section className="w-full py-4 pb-0 ">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black">
            Our Services
          </h2>
          <p className="text-gray-300 mt-4 text-lg">Cutting-edge immersive and AI solutions</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
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
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[350px] h-[440px] group cursor-pointer"
    >
      {/* Animated solid border container */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[3px] overflow-hidden">
        {/* Animated shine effect on border */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-[-100%] w-[300%] h-[300%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-shine"
            style={{
              transform: `translate(${mousePos.x - 50}%, ${mousePos.y - 50}%)`,
            }}
          />
        </div>
        
        {/* Inner card - NO SHADOW */}
        <div className="relative bg-gray-900 rounded-2xl h-full w-full p-8 flex flex-col justify-between items-center text-center transition-all duration-500 overflow-hidden">
          
          {/* Animated background particles effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Hover glow effect behind icon */}
          <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl transition-all duration-500 ${isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />

          <div className="relative z-10 w-full">
            {/* Icon with scale animation on hover */}
            <div className="mb-6">
              <div className={`transition-all duration-500 ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white transform transition-all duration-300">
                  {icon}
                </div>
              </div>
            </div>

            {/* Title - stays white on hover */}
            <h3 className={`text-2xl font-bold mb-3 text-white`}>
              {name}
            </h3>
          </div>

          {/* Description with fade up animation */}
          <p className={`text-gray-400 mb-6 px-2 leading-relaxed transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}`}>
            {description}
          </p>

          {/* Button with gradient background and white text */}
          <button className="px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Learn More
          </button>

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-purple-500/50 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-pink-500/50 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-blue-500/50 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-purple-500/50 rounded-br-lg" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}