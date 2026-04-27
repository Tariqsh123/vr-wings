import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Footer from "../components/footer";
import WhatsappFloat from "../components/WhatsappFloat";
import WhatsappPopup from "../components/WhatsappPop";
import BackToTop from "../components/BackToTop";

const BlogPage = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  // All blog posts data
  const allPosts = [
    {
      title: "Press: VR Wings and American College of Cardiology to Develop Immersive Training for Cardiovascular Professionals",
      date: "April 4, 2026",
    },
    {
      title: "Press: Research Continues to Support the Benefits of VR Wings for Surgical Training",
      date: "April 4, 2026",
    },
    {
      title: "Press: VR Wings Doubles Company Footprint, Attracts Top Talent as Demand for Innovation in Surgical Training Soars",
      date: "April 4, 2026",
    },
    {
      title: "Press: VR Wings Launches New Podcast Featuring Conversations from the Trenches of Healthcare Innovation",
      date: "April 4, 2026",
    },
    {
      title: "What are the benefits of virtual reality for surgical training?",
      date: "April 4, 2026",
    },
    {
      title: "Press: New Study Demonstrates Value of VR Training in Surgical Technique Performance and Radiographic Accuracy",
      date: "April 4, 2026",
    },
    {
      title: "VR Wings Receives FDA Clearance for Surgical Training Platform",
      date: "April 4, 2026",
    },
    {
      title: "How VR is Reshaping Medical Education: A Case Study",
      date: "April 4, 2026",
    },
    {
      title: "Press: VR Wings Partners with Leading Medical Schools Nationwide",
      date: "April 4, 2026",
    },
  ];

  const visiblePosts = allPosts.slice(0, visibleCount);
  const hasMore = visibleCount < allPosts.length;

  const handleViewMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, allPosts.length));
  };

  return (
    <div className="bg-white font-sans">
      {/* Header - Increased padding top */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        <p className="text-purple-600 font-medium text-lg">Blog</p>
        <h1 className="text-3xl text-gray-600 mt-2">
          The latest news, ideas and happenings at VR Wings
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Featured Article - Left Side */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src="https://picsum.photos/id/1015/1200/600"
                alt="VR Nurse Training"
                className="w-full h-[420px] object-cover"
              />
              <div className="p-8">
                <h2 className="text-4xl font-bold text-purple-600 leading-tight">
                  VR Nurse Training: 5 Key Takeaways from HealthStream x VR Wings
                </h2>
                <p className="text-gray-600 mt-4 text-lg">
                  How healthcare organizations are using VR to improve training, 
                  standardize skills practice, and achieve better patient outcomes with the data to prove it.
                </p>
                <p className="text-sm text-gray-500 mt-6">April 4, 2026</p>
              </div>
            </div>
          </div>

          {/* Sidebar Articles */}
          <div className="lg:col-span-4 space-y-8">
            {/* Ultimate Guide */}
            <div>
              <img
                src="https://picsum.photos/id/201/600/340"
                alt="Ultimate Guide"
                className="w-full rounded-2xl"
              />
              <h3 className="font-semibold text-xl mt-4 leading-tight">
                The Ultimate Guide to Using Virtual Reality in Graduate Medical Education Programs
              </h3>
              <p className="text-sm text-gray-500 mt-2">April 4, 2026</p>
            </div>

            {/* Fierce 15 */}
            <div className="bg-gradient-to-br from-purple-700 to-violet-600 text-white rounded-2xl p-6">
              <div className="flex justify-center mb-4">
                <img
                  src="https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/64c8b0b0b0f0e0e0e0e0e0e0_osso-fierce15-logo.png"
                  alt="Fierce 15"
                  className="h-12"
                />
              </div>
              <h3 className="font-semibold text-center text-lg">
                Press: VR Wings Named a Fierce 15 Company of 2023 by Fierce Healthcare
              </h3>
              <p className="text-xs text-center text-purple-200 mt-4">April 4, 2026</p>
            </div>

            {/* Leadership Expansion */}
            <div>
              <div className="flex gap-4">
                <img
                  src="https://picsum.photos/id/64/300/300"
                  alt="Stacie Frederick"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
                />
                <img
                  src="https://picsum.photos/id/65/300/300"
                  alt="Heather Gervais"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow -ml-6"
                />
              </div>
              <h3 className="font-semibold text-xl mt-6 leading-tight">
                Press: VR Wings Expands Leadership Team with Two New Hires
              </h3>
              <p className="text-sm text-gray-500 mt-2">April 4, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Grid Section with View More */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          <div className="grid md:grid-cols-3 gap-10">
            {visiblePosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: (index % 3) * 0.05 }}
                className="border-t border-gray-300 pt-6"
              >
                <h3 className="font-semibold text-lg leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mt-4">{post.date}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <div className="flex justify-center mt-12">
          {hasMore ? (
            <button
              onClick={handleViewMore}
              className="px-8 py-3 border-2 border-purple-400 rounded-full text-purple-600 font-medium hover:bg-purple-50 hover:border-purple-500 transition-all duration-200"
            >
              View More →
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(6)}
              className="px-8 py-3 border-2 border-purple-400 rounded-full text-purple-600 font-medium hover:bg-purple-50 transition-all duration-200"
            >
              Show Less ↑
            </button>
          )}
        </div>
      </div>

      {/* Footer / CTA Section */}
      {/* Desktop Layout - Same as before */}
      <div className="relative bg-[#7C3AED] overflow-hidden py-28 hidden lg:block">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
        
        {/* VR Headset - Left side */}
        <img
          src="https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d977f1c2950a7075aed961_8dccdbc99cae70c9067bdbd34262fbb4_Quest%20Headset-p-500.avif"
          alt="VR Wings Headset"
          className="absolute left-0 bottom-0 w-150 drop-shadow-2xl z-0 opacity-90"
        />

        {/* Controllers - Left side above headset */}
        <motion.img
          src="https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d9780703992805e91bf8e9_c7c6966debbfde812931b8e1056b37c3_Front%20Controller.avif"
          alt="VR Controller"
          className="absolute left-72 top-20 w-36 z-10 opacity-90"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.img
          src="https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d978173585577e903ea326_4b2588e5bc103e0c5bb342b8cf4c8ac0_Back%20Controller.avif"
          alt="VR Controller"
          className="absolute left-48 bottom-16 w-36 z-10 opacity-90"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Text Content - Centered with White Text */}
        <div className="relative z-20 text-center px-6">
          <h2 className="text-white text-6xl font-bold tracking-tight leading-tight">
            Purposeful Practice.<br />Confident Care.
          </h2>
          
          {/* CTA Button - Modern Design */}
          <div className="mt-12 flex justify-center">
            <button className="group relative bg-white text-purple-700 font-semibold px-12 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Speak to our team
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Optional: Small descriptive text */}
          <p className="text-purple-200 mt-6 text-sm">
            Join the leading healthcare institutions using VR Wings
          </p>
        </div>
      </div>

      {/* Mobile CTA Section - 1st image bottom center, 2nd & 3rd images top left/right */}
      <div className="relative bg-[#7C3AED] overflow-hidden py-16 lg:hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-2xl"></div>
        
        {/* Controller 1 - Top Left */}
        <motion.img
          src="https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d9780703992805e91bf8e9_c7c6966debbfde812931b8e1056b37c3_Front%20Controller.avif"
          alt="VR Controller"
          className="absolute left-2 top-2 w-14 z-10 opacity-70"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Controller 2 - Top Right */}
        <motion.img
          src="https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d978173585577e903ea326_4b2588e5bc103e0c5bb342b8cf4c8ac0_Back%20Controller.avif"
          alt="VR Controller"
          className="absolute right-2 top-2 w-14 z-10 opacity-70"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        />

        {/* VR Headset - Bottom Center */}
        <img
          src="https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68d977f1c2950a7075aed961_8dccdbc99cae70c9067bdbd34262fbb4_Quest%20Headset-p-500.avif"
          alt="VR Wings Headset"
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 drop-shadow-2xl z-0 opacity-80"
        />

        {/* Text Content - Centered with White Text - Mobile Optimized */}
        <div className="relative z-20 text-center px-4">
          <h2 className="text-white text-3xl font-bold tracking-tight leading-tight">
            Purposeful Practice.<br />Confident Care.
          </h2>
          
          {/* CTA Button - Smaller on Mobile */}
          <div className="mt-8 flex justify-center">
            <button className="group relative bg-white text-purple-700 font-semibold px-6 py-2.5 rounded-full text-sm shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95">
              <span className="relative z-10 flex items-center gap-1">
                Speak to our team
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Small descriptive text */}
          <p className="text-purple-200 mt-4 text-xs">
            Join the leading healthcare institutions using VR Wings
          </p>
        </div>
      </div>

      <Footer/>
<WhatsappFloat/>  
<WhatsappPopup/>
<BackToTop/>
    </div>
  );
};

export default BlogPage;