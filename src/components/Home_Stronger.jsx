function Home_Stronger() {
  const boxes = [
    {
      title: "Built with healthcare systems in mind",
      text: "Developed in collaboration with nurses, nurse leaders and system administrators nationwide, our scenarios are designed to empower systems to deliver high-quality care.",
      image: "https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68daae4578ce71339240122e_Built%20for%20graphic-p-1080.jpg",
    },
    {
      title: "Learn, assess, collaborate",
      text: "Developed in collaboration with nurses, nurse leaders and system administrators nationwide, our scenarios are designed to empower systems to deliver high-quality care.",
      image: "https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d9a3321cd6352b16667fc1_Built%20for%20nursing%20graphic.jpg",
    },
    {
      title: "Turning standards into action",
      text: "Developed in collaboration with nurses, nurse leaders and system administrators nationwide, our scenarios are designed to empower systems to deliver high-quality care.",
      image: "https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d99780ee8e329fe016fbc5_Debrief%20feature%20graphic%20plain.jpg",
    },
  ];

  return (
    <div className="flex flex-col items-center py-4">
      {/* Main Heading */}
      
      {/* Main container with stronger shadow and rounded corners */}
      <div className="w-[90%] max-w-[1200px] shadow-2xl rounded-[20px] p-6 flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-[#9063cd] mb-8 text-center">
        Stronger teams. Safer patients.
      </h2>

        {boxes.map((box, index) => {
          const isEven = index % 2 === 1; // second box image on left
          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-stretch gap-6 ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Left / Right text */}
             <div className="md:w-1/2 flex flex-col justify-center w-[90%] mx-auto md:pl-16 md:pr-8 text-center md:text-left">
  <h3 className="text-xl font-semibold mb-2">{box.title}</h3>
  <p className="text-gray-700">{box.text}</p>
</div>



              {/* Right / Left image */}
              <div className="md:w-1/2 flex justify-center items-center">
  <img
    src={box.image}
    alt={box.title}
    className="w-[90%] md:w-[75%] h-auto object-cover rounded-[20px]"
  />
</div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home_Stronger;
