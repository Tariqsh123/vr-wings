import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaRobot,
  FaShieldAlt,
  FaBrain,
  FaRegLightbulb,
  FaUserGraduate,
  FaCogs,
  FaChartLine,
  FaClock,
  FaTrophy,
  FaCheckCircle,
  FaPlay,
  FaGlobe,
  FaLayerGroup,
  FaMicrochip,
  FaAward,
  FaHandsHelping,
  FaUsers,
  FaServer,
} from "react-icons/fa";
import Footer from "../components/footer";


export default function ModulePage() {
  const { slug } = useParams();
  const [module, setModule] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = {
      surgicaltrainingmodule: {
        title: "VR Surgical Training Simulation",
        img: "https://www.htfmarketintelligence.com/uploads/reports/16722299241678.webp",
        description:
          "Advanced VR medical training system designed for realistic surgical practice with zero risk and real-time performance tracking.",
        longDescription:
          "This VR Surgical Training Simulation is built for modern medical education systems, hospitals, and training institutes. It replicates real surgical environments including operation rooms, medical instruments, patient vitals, and emergency scenarios. Trainees can practice complex procedures repeatedly without any real-world risk, improving precision, confidence, and decision-making speed. The system includes detailed anatomical models, real-time tissue response, and comprehensive performance metrics that track every movement and decision made during procedures.",
        detailedDescription: "Our VR surgical training platform represents a paradigm shift in medical education. Unlike traditional cadaver-based training or observation-only methods, this simulation provides hands-on experience with immediate feedback. Trainees can practice everything from basic suturing to complex organ transplants in a risk-free environment. The system tracks over 50 different performance metrics including incision precision, instrument handling, time efficiency, and complication avoidance. Each session generates a detailed report that compares performance against expert benchmarks. The platform also supports multi-user scenarios where surgical teams can practice coordinated procedures together, improving communication and teamwork skills that are critical in operating rooms. With support for major VR headsets and haptic gloves, the tactile feedback creates an unprecedented level of realism that bridges the gap between simulation and actual surgery.",
        stats: [
          { value: "94%", label: "Skill Retention" },
          { value: "40%", label: "Faster Training" },
          { value: "0", label: "Real Risk" },
        ],
        certifications: ["AMA Accredited", "ACGME Compliant", "Global Standard", "FDA Class II", "CE Certified"],
        technologies: ["Haptic Feedback", "Real-time Metrics", "Multi-player Mode", "AI Guidance", "Voice Commands"],
        benefitsList: [
          "Reduce training costs by eliminating expensive cadaver labs",
          "Enable unlimited practice repetitions without resource constraints",
          "Standardize training across multiple institutions globally",
          "Generate objective performance data for credentialing decisions",
          "Provide immediate corrective feedback during procedures",
          "Simulate rare complications that trainees rarely encounter"
        ]
      },
      firesafetymodule: {
        title: "Industrial Fire Safety Training",
        img: "https://itra.com.au/wp-content/uploads/2019/03/vr_fire.jpg",
        description:
          "Immersive fire safety training system for industrial emergency response and hazard control.",
        longDescription:
          "This module simulates real industrial fire hazards including factories, warehouses, oil plants, and chemical environments. Users learn how to identify fire risks, operate extinguishers, manage evacuation procedures, and coordinate emergency response teams under pressure. The system includes dynamic fire propagation, smoke effects, and realistic heat feedback for maximum immersion. Trainees experience everything from small electrical fires to large-scale industrial blazes.",
        detailedDescription: "Industrial fire accidents cause billions in damages and countless injuries every year. Our VR training module addresses the root cause of these incidents: inadequate preparation. Traditional fire safety training often involves watching videos or attending lectures, which fails to prepare workers for the stress and chaos of a real fire. This simulation changes that by immersing trainees in photorealistic fire scenarios where every second counts. Users learn proper extinguisher selection and technique, evacuation leadership, emergency communication protocols, and post-fire assessment procedures. The system simulates various fire classes including electrical, chemical, gas, and combustible materials. Advanced AI controls fire spread based on user actions, wind direction, and available suppression methods. After each scenario, trainees receive detailed debriefings highlighting correct actions and areas for improvement. Organizations using our system report 87% fewer fire-related incidents and 3x faster emergency response times.",
        stats: [
          { value: "87%", label: "Incident Reduction" },
          { value: "3x", label: "Faster Response" },
          { value: "100%", label: "Compliance" },
        ],
        certifications: ["OSHA Certified", "NFPA Standard", "ISO 45001", "EPA Compliant", "Global Safe认证"],
        technologies: ["Dynamic Fire Physics", "Multi-scenario Library", "Debrief Tools", "Heat Feedback", "Smoke Simulation"],
        benefitsList: [
          "Achieve OSHA/NFPA compliance with verifiable training records",
          "Reduce insurance premiums through documented safety training",
          "Train hundreds of employees simultaneously without facility disruption",
          "Simulate dangerous scenarios impossible to recreate safely in real life",
          "Track response times and decision-making under pressure",
          "Customize scenarios for specific facility layouts and hazards"
        ]
      },
      droneoperationmodule: {
        title: "Drone Operation Simulation",
        img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1278060/ss_00a41b66228f5a328db44f729d2665b145981c64.1920x1080.jpg",
        description:
          "Professional drone flight simulation for navigation, control, and mission-based operations.",
        longDescription:
          "A highly realistic drone training environment with advanced flight physics, weather conditions, obstacle navigation, and mission-based scenarios. It is widely used in defense, agriculture, surveillance, and logistics training programs. The simulation includes real-world drone models, customizable payloads, and mission planning tools for comprehensive operator training. Users can practice everything from basic hovering to complex search and rescue missions.",
        detailedDescription: "The commercial drone industry is growing at an unprecedented rate, creating massive demand for qualified pilots. Traditional flight training is expensive, weather-dependent, and risks damaging expensive equipment. Our VR simulation eliminates these barriers by providing a safe, cost-effective training environment that works in any weather, 24/7. The system accurately models real drone physics including wind effects, battery drain, GPS signal loss, and emergency procedures. Users can practice on over 25 different drone models including quadcopters, fixed-wing, and heavy-lift cargo drones. The scenario library includes search and rescue, infrastructure inspection, agricultural surveying, package delivery, and cinematography. Each mission includes realistic payload management, flight planning, obstacle avoidance, and emergency landing procedures. Advanced users can create custom missions using our mission editor. The system also prepares pilots for FAA Part 107 and EASA certification exams with built-in testing modules.",
        stats: [
          { value: "99%", label: "Flight Accuracy" },
          { value: "25+", label: "Drone Models" },
          { value: "50+", label: "Scenarios" },
        ],
        certifications: ["FAA Part 107 Prep", "EASA Certified", "DGCA Aligned", "CAA Compliant", "Transport Canada"],
        technologies: ["Real Physics Engine", "Weather System", "Mission Editor", "Payload Simulator", "Camera Controls"],
        benefitsList: [
          "Save thousands in equipment damage and repair costs",
          "Train year-round regardless of weather conditions",
          "Practice emergency procedures too dangerous for real flight",
          "Prepare for certification exams with built-in testing",
          "Standardize training across multiple pilot candidates",
          "Generate detailed flight logs for compliance records"
        ]
      },
      industrialmodule: {
        title: "Industrial Manufacturing Simulation",
        img: "https://skyreal.tech/wp-content/thumbnails/uploads/2023/06/picture_20201102-184002-1.png",
        description:
          "VR-based factory training system for industrial operations and manufacturing workflows.",
        longDescription:
          "This module replicates modern industrial production lines, machinery operations, and safety protocols. It allows workers to practice real factory environments including assembly lines, machine handling, and production quality checks. The system integrates with IoT sensors to provide real-time feedback on operational efficiency and error prevention. Workers can master complex machinery without risking expensive equipment or production downtime.",
        detailedDescription: "Manufacturing industries face a critical skills gap as experienced workers retire and new hires lack hands-on experience. Traditional on-the-job training slows production and risks costly mistakes. Our VR manufacturing simulation solves this by providing immersive training that doesn't interrupt factory operations. Workers learn to operate CNC machines, robotic arms, conveyor systems, and quality control stations in a virtual factory identical to your actual facility. The system includes digital twin technology that mirrors real equipment behavior and control interfaces. Trainees can practice setup procedures, calibration, maintenance, troubleshooting, and emergency stops without any production downtime or safety risks. Real-time performance tracking identifies exactly where each worker needs improvement. The platform also supports remote training, allowing experts to guide multiple trainees simultaneously from anywhere in the world. Organizations using our system report 56% fewer errors, 35% faster onboarding, and 22% productivity gains.",
        stats: [
          { value: "56%", label: "Fewer Errors" },
          { value: "35%", label: "Faster Onboarding" },
          { value: "22%", label: "Productivity Gain" },
        ],
        certifications: ["Industry 4.0 Ready", "Lean Manufacturing", "Six Sigma Aligned", "ISO 9001", "CE Certified"],
        technologies: ["Digital Twin", "Analytics Dashboard", "Role-based Access", "PLC Integration", "Remote Instructor"],
        benefitsList: [
          "Eliminate production downtime during training",
          "Prevent costly equipment damage from inexperienced operators",
          "Standardize procedures across multiple shifts and facilities",
          "Accelerate new hire time-to-productivity dramatically",
          "Document training completion for audit compliance",
          "Enable remote expert guidance and assessment"
        ]
      },
      pilottrainingmodule: {
        title: "Aviation Pilot Training Simulation",
        img: "https://defence-industry.eu/wp-content/uploads/2023/09/Finland-purchases-Hawk-Full-Mission-Simulator-from-Patria-01.jpg",
        description:
          "Advanced flight simulator for professional pilot training and aviation skills.",
        longDescription:
          "A full cockpit simulation system designed for pilot training with real flight physics, navigation systems, weather effects, and emergency handling scenarios. It helps trainees gain real-world flying experience safely. The module includes multiple aircraft models, international airport databases, ATC communication practice, and emergency procedure training for engine failures, severe weather, and system malfunctions.",
        detailedDescription: "Professional pilot training requires hundreds of flight hours before certification, making it one of the most expensive and time-consuming educational paths. Our VR flight simulation dramatically reduces these costs while improving training outcomes. The system features fully modeled cockpits with functional instruments, switches, and controls that behave exactly like real aircraft. Flight physics accurately model stall characteristics, crosswind landings, engine performance, and weight distribution. The global airport database includes over 24,000 airports with accurate runways, taxiways, approaches, and surrounding terrain. Trainees practice VFR and IFR navigation, ATC communications, emergency procedures including engine failure, fires, depressurization, and system malfunctions. The system also models weather conditions including icing, turbulence, low visibility, and microbursts. Detailed debriefing tools replay every flight with instrument data, allowing instructors to analyze decisions and technique. Airlines and flight schools using our system report 60% lower training costs and 95% certification pass rates.",
        stats: [
          { value: "1000+", label: "Flight Hours" },
          { value: "60%", label: "Cost Reduction" },
          { value: "95%", label: "Pass Rate" },
        ],
        certifications: ["FAA Approved", "EASA FTD Level 5", "ICAO Compliant", "CASA Certified", "ATPL Credit"],
        technologies: ["Full Cockpit Replica", "Live ATC Integration", "Weather Engine", "Global Airports", "Debrief Tools"],
        benefitsList: [
          "Reduce flight training costs by up to 60%",
          "Practice emergency procedures too dangerous for real aircraft",
          "Train regardless of weather or aircraft availability",
          "Generate objective performance data for student assessment",
          "Standardize training across instructor and location",
          "Prepare students for checkrides with scenario rehearsal"
        ]
      },
      constructionsitemodule: {
        title: "Construction Site Planning Simulation",
        img: "https://cdn2.unrealengine.com/Unreal+Engine/spotlights/vr-construction.jpg",
        description:
          "VR construction training system for site planning, safety, and equipment handling.",
        longDescription:
          "This module simulates real construction environments including site planning, machinery operations, safety management, and project coordination. It helps engineers and workers understand construction workflows effectively. The simulation includes heavy equipment operation, material logistics, safety hazard identification, and project timeline management with real-time collaboration features.",
        detailedDescription: "Construction sites are among the most dangerous workplaces, with falls, equipment accidents, and struck-by incidents causing thousands of injuries annually. Many of these accidents result from inadequate training and unfamiliarity with site hazards. Our VR construction simulation provides immersive safety training that dramatically reduces incident rates. Workers navigate photorealistic job sites where they must identify hazards, select appropriate PPE, operate heavy equipment, and coordinate with team members. The system includes accurate models of excavators, cranes, bulldozers, and aerial lifts with realistic controls and physics. Safety scenarios include fall protection, trench safety, electrical hazards, confined spaces, and crane operations. Project managers use the system to plan site layouts, optimize material flow, and identify potential conflicts before construction begins. The simulation also supports multi-user training where entire crews practice coordinated operations. Organizations using our system report 72% improvement in safety metrics, 30% faster project completion, and 15% reduction in material waste.",
        stats: [
          { value: "72%", label: "Safety Improvement" },
          { value: "30%", label: "Efficiency Gain" },
          { value: "15%", label: "Less Waste" },
        ],
        certifications: ["NCCER Aligned", "CSCS Approved", "OSHA 30 Compatible", "LEED Credit", "ISO 45001"],
        technologies: ["Heavy Equipment Sims", "Project Timeline Tools", "Safety Scanner", "Site Planner", "Multi-user Sync"],
        benefitsList: [
          "Reduce on-site accidents and injury claims",
          "Identify hazards before workers step on actual sites",
          "Train heavy equipment operators without fuel or wear costs",
          "Optimize site layout before construction begins",
          "Document safety training for compliance and litigation protection",
          "Enable remote site walkthroughs for project stakeholders"
        ]
      },
    };

    setModule(data[slug] || null);
    setTimeout(() => setIsLoaded(true), 100);
  }, [slug]);

  if (!module) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
            <FaRobot className="text-3xl text-purple-600 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">Module Not Found</h1>
          <p className="text-gray-500 text-sm">The training module you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white text-black transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* HERO SECTION */}
      <div className="relative h-[80vh] min-h-[550px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={module.img}
            className="absolute w-full h-full object-cover transform scale-105 animate-slowZoom"
            alt={module.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slideUp leading-tight">
            {module.title}
          </h1>
          <p className="max-w-2xl text-gray-200 text-base md:text-lg animate-fadeIn delay-200 leading-relaxed">
            {module.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 animate-fadeIn delay-300">
            <button className="group px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-semibold shadow-lg text-sm">
              <FaPlay className="text-xs group-hover:animate-pulse" />
              Start Training
            </button>
            <button className="px-6 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-all border border-white/30 font-semibold text-sm">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-scrollDot"></div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="py-12 px-4 bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {module.stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-500 font-medium tracking-wide text-xs uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT SECTION - More text */}
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            About This Module
          </h2>
          <p className="text-gray-600 leading-relaxed text-base mb-6">
            {module.longDescription}
          </p>
          <p className="text-gray-600 leading-relaxed text-base mb-6">
            {module.detailedDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {module.certifications.map((cert, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFITS SECTION - Detailed list */}
      <div className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Why Organizations Choose This</h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto">
            Real business outcomes from real implementation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {module.benefitsList.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaCheckCircle className="text-purple-400 text-sm mt-0.5 flex-shrink-0" />
                <span className="text-gray-200 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <Benefit title="Accelerated Learning" desc="Reduce training time by up to 50% with immersive hands-on practice that reinforces concepts through repetition and muscle memory" icon={<FaClock />} delay={0} />
          <Benefit title="Real-World Experience" desc="Practice realistic scenarios identical to actual work environments before facing real-world pressure and consequences" icon={<FaTrophy />} delay={100} />
          <Benefit title="Unmatched Safety" desc="Eliminate operational risks during critical skill development by training in a controlled virtual environment" icon={<FaShieldAlt />} delay={200} />
          <Benefit title="Cost Efficiency" desc="Lower equipment and facility costs with virtual replication that eliminates consumables, travel, and wear-and-tear" icon={<FaChartLine />} delay={300} />
          <Benefit title="Measurable Results" desc="Data-driven insights to track progress and competency with detailed analytics on every training session" icon={<FaCheckCircle />} delay={400} />
          <Benefit title="Global Accessibility" desc="Train distributed teams with consistent quality anywhere in the world, eliminating geographic barriers" icon={<FaGlobe />} delay={500} />
        </div>
      </div>

      {/* TECHNOLOGIES SECTION */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Technology Stack</h2>
            <p className="text-gray-500 text-sm">Industry-leading systems powering immersive learning experiences</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {module.technologies.map((tech, idx) => (
              <div key={idx} className="group flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-purple-50 transition-all duration-300 hover:shadow-sm border border-gray-100">
                <FaLayerGroup className="text-purple-500 text-sm group-hover:rotate-12 transition" />
                <span className="font-medium text-gray-700 text-sm">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADVANCED FEATURES SECTION - MOVED TO END */}
      <div className="py-16 px-4 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Advanced Features</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Built with enterprise-grade VR simulation technology and cutting-edge learning science
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <FeatureCard icon={<FaRobot />} title="AI Simulation Engine" desc="Adaptive AI that responds to user actions creating realistic, unpredictable training scenarios that evolve with skill level" delay={0} />
          <FeatureCard icon={<FaShieldAlt />} title="Zero Risk Environment" desc="Practice dangerous procedures safely without any real-world consequences, liability, or equipment damage" delay={100} />
          <FeatureCard icon={<FaBrain />} title="Cognitive Training" desc="Enhances memory retention and decision-making speed under pressure through spaced repetition and stress inoculation" delay={200} />
          <FeatureCard icon={<FaRegLightbulb />} title="Smart Feedback System" desc="Real-time corrections and performance analytics during every training session with instant actionable insights" delay={300} />
          <FeatureCard icon={<FaUserGraduate />} title="Professional Learning" desc="Industry-standard modules designed with subject matter experts and aligned to certification requirements" delay={400} />
          <FeatureCard icon={<FaCogs />} title="System Integration" desc="Seamless integration with major VR hardware platforms and enterprise LMS systems including SCORM compliance" delay={500} />
          <FeatureCard icon={<FaChartLine />} title="Performance Analytics" desc="Detailed progress tracking and competency assessment reports with exportable data for compliance audits" delay={600} />
          <FeatureCard icon={<FaGlobe />} title="Multi-User Scenarios" desc="Collaborative training with teams across different locations in shared virtual environments with voice chat" delay={700} />
          <FeatureCard icon={<FaMicrochip />} title="Hardware Optimized" desc="Smooth performance on leading VR headsets including Meta Quest, HTC Vive, Pico, and Varjo with cross-platform support" delay={800} />
          <FeatureCard icon={<FaAward />} title="Certification Ready" desc="Training modules aligned with industry certifications including OSHA, FAA, AMA, and ISO standards" delay={900} />
          <FeatureCard icon={<FaHandsHelping />} title="Accessibility Support" desc="Built-in accommodations for diverse learners including subtitles, audio descriptions, and adjustable difficulty" delay={1000} />
          <FeatureCard icon={<FaServer />} title="Cloud Deployment" desc="Enterprise-grade cloud infrastructure with SSO, role-based access, and detailed audit logging for compliance" delay={1100} />
        </div>
      </div>
      <Footer/>
    </div>
  );
}

/* FEATURE CARD */
function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <div
      className="group p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 text-center animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-purple-600 text-2xl mb-3 flex justify-center group-hover:scale-110 transition duration-300">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2 group-hover:text-purple-700 transition">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

/* BENEFIT CARD */
function Benefit({ title, desc, icon, delay = 0 }) {
  return (
    <div
      className="p-5 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 text-center border border-white/10 hover:border-white/20 animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-2xl mb-2 flex justify-center text-purple-400">{icon}</div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}