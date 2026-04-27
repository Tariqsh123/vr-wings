import { useEffect } from "react";
import Footer from "../components/footer";
import WhatsappFloat from "../components/WhatsappFloat";
import WhatsappPopup from "../components/WhatsappPop";
import BackToTop from "../components/BackToTop";

function ScheduleDemo() {

  // Calendly script load
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>

      {/* ===== SCHEDULE SECTION ===== */}
      <div id="Schedule-Demo-main-container">
        <div id="schedule-top-main-container">

          <div id="schedule-top-container">
            <h4>Contact VR Wings Experts</h4>
            <h2>Elevate Your Brand with VR Wings Digital Solutions</h2>
            <p>
              Work Smarter, Grow Faster, and Achieve Real Results with Our Expert Digital Services
            </p>
            <span>
              Book a 30-Minute Consultation to Discover How VR Wings Can Transform Your Business
            </span>
          </div>

          <div id="schedule-calendly-container">
            <h2>Schedule Your Strategy Session with VR Wings!</h2>

            <div
              className="calendly-inline-widget"
              id="calendly-widget"
              data-url="https://calendly.com/channnelll123/30min"
              style={{ width: "100%", height: "700px" }}
            ></div>

          </div>

        </div>
      </div>

      {/* ===== OTHER COMPONENTS ===== */}
      <Footer/>
      <WhatsappFloat/>
      <WhatsappPopup/>
      <BackToTop/>

    </div>
  );
}

export default ScheduleDemo;