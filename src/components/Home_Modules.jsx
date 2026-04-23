import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "VR Surgical Training Simulation",
    img: "https://www.htfmarketintelligence.com/uploads/reports/16722299241678.webp",
    link: "/module/surgicaltrainingmodule",
  },
  {
    title: "Industrial Fire Safety Training",
    img: "https://itra.com.au/wp-content/uploads/2019/03/vr_fire.jpg",
    link: "/module/firesafetymodule",
  },
  {
    title: "Drone Operation Simulation",
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1278060/ss_00a41b66228f5a328db44f729d2665b145981c64.1920x1080.jpg?t=1762421410",
    link: "/module/droneoperationmodule",
  },
  {
    title: "Industrial Manufacturing",
    img: "https://skyreal.tech/wp-content/thumbnails/uploads/2023/06/picture_20201102-184002-1-tt-width-875-height-301-fill-0-crop-0-bgcolor-eeeeee-except_gif-1-post_id-0.png",
    link: "/module/industrialmodule",
  },
  {
    title: "Aviation Pilot Training Simulation",
    img: "https://defence-industry.eu/wp-content/uploads/2023/09/Finland-purchases-Hawk-Full-Mission-Simulator-from-Patria-01.jpg",
    link: "/module/pilottrainingmodule",
  },
  {
    title: "Construction Site Planning",
    img: "https://cdn2.unrealengine.com/Unreal+Engine%2Fspotlights%2Finteractive-vr-training-improves-construction-site-safety-and-roi%2FSpotlight_Twinsite_blog_feature_img_-1920x960-c8d4d53e06ae882b17d3ea816f05a32aea595ea5.jpg",
    link: "/module/constructionsitemodule",
  },
];

export default function HomeModules() {
  return (
    <section className="py-[40px] bg-white">
      <div className="max-w-[1300px] mx-auto p-[20px]">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Our Most In-Demand Modules
          </h2>

          <div className="w-20 h-[3px] bg-purple-600 mx-auto rounded-full mb-4"></div>

          <p className="text-gray-600 text-lg sm:text-xl max-w-[800px] mx-auto">
            We deliver immersive, high-impact simulations designed to train, engage,
            and transform real-world performance across industries.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((item, i) => (
            <ModuleCard key={i} {...item} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ModuleCard({ title, img, link }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setTilt({
      x: (-y / rect.height) * 8,
      y: (x / rect.width) * 8,
    });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <Link
      to={link}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="group relative h-[280px] rounded-[18px] overflow-hidden bg-white shadow-md hover:shadow-xl transition duration-300 block"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Image */}
      <img
        src={img}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>

      {/* Content */}
      <div className="absolute bottom-0 p-4 w-full">
        <h3 className="text-white text-lg font-semibold leading-snug">
          {title}
        </h3>
      </div>
    </Link>
  );
}