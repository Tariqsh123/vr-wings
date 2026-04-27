import React from "react";
import "../App.css";
import { Link } from "react-router-dom";


const badges = [
  // ❌ COMMENTED (Glassdoor)
  {
    img: "https://thebravenext.com/images/glassdoor.png",
    link: "#",
    title: "Glassdoor",
    active: true,
  },

  // ❌ COMMENTED (Capterra)
  {
    img: "https://thebravenext.com/images/Capterra.png",
    link: "#",
    title: "Capterra",
    active: true,
  },

  // ✅ Clutch
  {
    img: "https://thebravenext.com/images/Clutch.png",
    link: "#",
    title: "Clutch",
    active: true,
  },

  // ✅ G2
  {
    img: "https://thebravenext.com/images/G2.png",
    link: "#",
    title: "G2 Crowd",
    active: true,
  },

  // ✅ Sitejabber
  {
    img: "https://thebravenext.com/images/SiteJabbar.png",
    link: "#",
    title: "Sitejabbar",
    active: true,
  },

  // ❌ COMMENTED (Goodfirms)
  {
    img: "https://thebravenext.com/images/Goodfirms.png",
    link: "#",
    title: "GoodFirms",
    active: true,
  },

  // ❌ COMMENTED (Designrush)
  {
    img: "https://thebravenext.com/images/designrush.png",
    link: "#",
    title: "Design Rush",
    active: true,
  },

  // ✅ Trustpilot
  {
    img: "https://thebravenext.com/images/TrustPilot.png",
    link: "#",
    title: "Trust Pilot",
    active: true,
  },

  // ❌ COMMENTED (Tech Behemoths)
  {
    img: "https://thebravenext.com/images/Tech-Behamoth.png",
    link: "#",
    title: "Tech Behemoths",
    active: true,
  },

  // ✅ Facebook
  {
    img: "https://thebravenext.com/images/Facebook-Review.png",
    link: "#",
    title: "Facebook",
    active: true,
  },

  // ✅ Google
  {
    img: "https://thebravenext.com/images/google-reviews.png",
    link: "#",
    title: "Google",
    active: true,
  },

  // ✅ Sortlist
  {
    img: "https://thebravenext.com/images/Sort List.png",
    link: "#",
    title: "Sortlist",
    active: true,
  },

  // ❌ COMMENTED (Top Developers)
  {
    img: "https://thebravenext.com/images/Top Developers.png",
    link: "#",
    title: "Top Developers",
    active: true,
  },

  // ✅ LinkedIn
  {
    img: "https://thebravenext.com/images/Linkeding-Badge.png",
    link: "https://www.linkedin.com/company/vrwing/",
    title: "LinkedIn",
    active: true,
  },
];

function BadgeGrid() {
  return (
    <>
      <div className="badge-heading">
        <h2>What Our Clients Say About The VR Wings</h2>
      </div>

      <div className="badge-container">
        <div className="badge-inner">

          {/* 🔥 Active badges render */}
          {badges
            .filter((badge) => badge.active)
            .map((badge, index) => (
              <a
                key={index}
                href={badge.link}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-box"
              >
                <img src={badge.img} alt={badge.title} />
                <p>Read Our Reviews On</p>
                <span>
                  Recognized as Top Software Developers by{" "}
                  <b>{badge.title}</b>
                </span>
              </a>
            ))}

          {/* 🧠 COMMENTED ITEMS (visible in code only, like HTML comments) */}
          {/*
            {badges
              .filter((badge) => !badge.active)
              .map((badge, index) => (
                <div key={index}>{badge.title}</div>
              ))}
          */}

        </div>

       
<Link to="/testimonials">
  <button>Read More Reviews</button>
</Link>
      </div>
    </>
  );
}

export default BadgeGrid;