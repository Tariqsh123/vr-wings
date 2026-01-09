import heroVideo from '../assets/video.webm';

export default function Home_Hero() {
  return (
    <section className="relative w-full overflow-hidden z-0" style={{ height: '130vh', marginBottom:'0'}}>

      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-flex-start items-center px-6 text-center z-10 pt-50">
        <div className="max-w-[1200px] w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-6xl font-bold text-white leading-tight mb-6 text-center">
            VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered simulation & copilot solutions for learning and business growth
          </h1>

          <button className="px-8 py-3 bg-[#9000ff] text-white font-semibold rounded-[30px] shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
            Osso Nurse Training
            <span className="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              {'>'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
