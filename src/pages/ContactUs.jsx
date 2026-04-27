import React from "react";
import Footer from "../components/footer";
import WhatsappFloat from "../components/WhatsappFloat";
import WhatsappPopup from "../components/WhatsappPop";
import BackToTop from "../components/BackToTop";



export default function ContactUs() {
  return (
    <div className="w-full bg-[#f5f3f7] pt-20">

      {/* HERO WITH IMAGE */}
      <div className="w-full relative overflow-hidden">

        {/* BLURRED BACKGROUND */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[8px]"
          style={{
            backgroundImage:
              "url(https://cdn.prod.website-files.com/60c079a900a87db2d13e7134/68ddc45a5b263bd7cbdb8348_ossocontactus4.png)",
          }}
        />

        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 bg-white/60"></div>

        {/* CLOUDY BOTTOM FADE */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[#f5f3f7]"></div>

        {/* CONTENT */}
        <div className="relative max-w-5xl mx-auto px-6 py-20 pb-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-md">

            <p className="text-[#8b5cf6] font-medium mb-3">
              Request a custom walkthrough
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold text-[#1e3a8a] leading-tight mb-4">
              Build a confident, independent workforce faster
            </h1>

            <p className="text-gray-600 text-sm md:text-base max-w-2xl">
              We help organizations leverage immersive technology to accelerate
              training, improve performance, and scale efficiently.
            </p>

          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto mt-16 px-6 pb-20" >
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">

          <form className="space-y-6">

            <div>
              <label className="text-sm font-semibold text-gray-700">FIRST NAME *</label>
              <input type="text" placeholder="First name"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none"/>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">LAST NAME *</label>
              <input type="text" placeholder="Last name"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none"/>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">COMPANY / ORGANIZATION *</label>
              <input type="text" placeholder="Company / Organization"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none"/>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">INDUSTRY *</label>
              <select className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none">
                <option>Select one...</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Technology</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">EMAIL *</label>
              <input type="email" placeholder="Email"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none"/>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">HOW'D YOU HEAR ABOUT US</label>
              <select className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none">
                <option>Select one...</option>
                <option>Google</option>
                <option>Social Media</option>
                <option>Referral</option>
              </select>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" className="mt-1"/>
              <p>I would like to receive updates and promotions.</p>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium hover:opacity-90 transition"
            >
              Submit
            </button>

          </form>
        </div>
      </div>

      <Footer/>
<WhatsappFloat/>  
<WhatsappPopup/>
<BackToTop/>
    </div>
  );
}