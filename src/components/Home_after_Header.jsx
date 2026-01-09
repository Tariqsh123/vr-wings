function Home_after_Header() {
  return (
    <div className="relative h-[fit-content] bg-gradient-to-b from-white/10 to-white p-0">
      {/* White smoke effect */}
      <div className="absolute -top-50 left-0 w-full h-60 bg-gradient-to-t from-white to-white/0 pointer-events-none z-1"></div>
      <div className="absolute -top-30 left-0 w-full h-60 bg-gradient-to-t from-white to-white/1 pointer-events-none z-1"></div>

      {/* Main Content */}
      <div className="relative z-1 flex flex-col items-center gap-6 max-w-5xl mx-auto text-center pt-9">
        {/* Heading */}
        <h1 className="text-4xl font-bold" style={{ color: "#9000ff" }}>
          Osso Nurse Training
        </h1>

        {/* Paragraphs */}
        <p className="text-xl" style={{ color: "#9063cd" }}>
          Develop confident, independent nurses faster
        </p>
        <p className="text-base text-black max-w-3xl">
          Rapidly scale new-nurse onboarding in the procedural skills that matter most across your hospitals and health systems with the Osso VR Nursing Series and companion Osso Loop™ learning platform.
        </p>

        {/* Cards Row */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
  {/* Card 1 */}
  <div className="w-[340px] bg-white p-6 rounded-[20px] shadow-2xl text-left">
    <h2 className="text-2xl font-semibold text-purple-600">
      Osso VR Nursing Series
    </h2>
    <h3 className="text-xl font-semibold text-green-600 mt-10">
      What’s included?
    </h3>
    <ul className="mt-3 space-y-5">
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Clinically accurate VR procedural skills scenarios
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Multi-modal model with both individual and collaborative learning
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Immediate performance-based feedback
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Rooted in national safety and competency benchmarks
      </li>
    </ul>
  </div>

  {/* Card 2 */}
  <div className="w-[340px] bg-white p-6 rounded-[20px] shadow-2xl text-left">
    <h2 className="text-2xl font-semibold text-purple-600">
      Osso Loop™ Learning Platform
    </h2>
    <h3 className="text-xl font-semibold text-green-600 mt-10">
      What’s included?
    </h3>
    <ul className="mt-3 space-y-5">
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Track progress across multiple procedural skills
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Real-time feedback for learners and instructors
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Collaborative learning and performance benchmarking
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500">●</span>
        Integrated with VR scenarios for seamless skill reinforcement
      </li>
    </ul>
  </div>
</div>

      </div>
    </div>
  );
}

export default Home_after_Header;
