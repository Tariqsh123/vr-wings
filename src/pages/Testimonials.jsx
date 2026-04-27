import React, { useState, useEffect, useMemo } from "react";
import Footer from "../components/footer";
import WhatsappFloat from "../components/WhatsappFloat";
import WhatsappPopup from "../components/WhatsappPop";
import BackToTop from "../components/BackToTop";

// ---------- BADGES ----------
const badges = {
  Clutch: "https://thebravenext.com/images/Clutch.png",
  G2: "https://thebravenext.com/images/G2.png",
  Sitejabber: "https://thebravenext.com/images/SiteJabbar.png",
  Trustpilot: "https://thebravenext.com/images/TrustPilot.png",
  Facebook: "https://thebravenext.com/images/Facebook-Review.png",
};

// ---------- DATA ----------
const data = {
  Clutch: [
    "Great experience with The Brave Next.",
    "Exceptional service and timely delivery.",
    "Highly professional team.",
    "They understand client needs perfectly.",
    "Highly recommended agency.",
  ],
  G2: [
    "Amazing workplace culture.",
    "Supportive environment.",
    "Strong leadership team.",
    "Innovation focused work.",
    "Great growth opportunities.",
  ],
  Trustpilot: [
    "Flawless experience.",
    "Always on-time delivery.",
    "Creative execution.",
    "Great communication.",
    "Top quality service.",
  ],
  Facebook: [
    "Professional and friendly team.",
    "Fast response time.",
    "Smooth experience overall.",
    "Highly recommended.",
    "Excellent service quality.",
  ],
};

// ---------- HOOK ----------
function useCarousel(length, delay = 3000) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((p) => (p + 1) % length);
  const prev = () => setIndex((p) => (p - 1 + length) % length);

  useEffect(() => {
    const t = setInterval(next, delay);
    return () => clearInterval(t);
  }, []);

  return { index, next, prev };
}

// ---------- SCREEN SIZE HOOK ----------
function useCardsPerView() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 768) setCount(1);
      else if (window.innerWidth <= 1024) setCount(2);
      else setCount(3);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

// ---------- CAROUSEL ----------
const Carousel = ({ items }) => {
  const { index, next, prev } = useCarousel(items.length);
  const cardsPerView = useCardsPerView();

  const visible = useMemo(() => {
    const get = (i) => items[(i + items.length) % items.length];
    return Array.from({ length: cardsPerView }, (_, i) =>
      get(index + i)
    );
  }, [index, items, cardsPerView]);

  return (
    <div className="carousel">
      <button className="nav left" onClick={prev}>❮</button>

      <div className="track">
        {visible.map((text, i) => (
          <div className="card" key={i}>
            <div className="stars">★★★★★</div>
            <p>{text}</p>
            <div className="bottom">Posted on Verified Platform</div>
          </div>
        ))}
      </div>

      <button className="nav right" onClick={next}>❯</button>
    </div>
  );
};

// ---------- SECTION HEADER ----------
const SectionHeader = ({ title, icon }) => {
  return (
    <div className="section-header">
      <img src={icon} alt={title} />
      <h2>{title}</h2>
    </div>
  );
};

// ---------- SECTION ----------
const Section = ({ title, items, icon }) => (
  <div className="section">
    <SectionHeader title={title} icon={icon} />
    <Carousel items={items} />
  </div>
);

// ---------- MAIN ----------
export default function Testimonials() {
  return (
    <div className="page">

      {/* HEADER */}
      <div className="header">
        <h1>Testimonials</h1>
        <p>
          100% client satisfaction focus. We treat every project like our own.
        </p>
      </div>

      {/* SECTIONS */}
      <Section title="Clutch Reviews" items={data.Clutch} icon={badges.Clutch} />
      <Section title="G2 Reviews" items={data.G2} icon={badges.G2} />
      <Section title="Trustpilot Reviews" items={data.Trustpilot} icon={badges.Trustpilot} />
      <Section title="Facebook Reviews" items={data.Facebook} icon={badges.Facebook} />

      {/* STYLE */}
      <style>{`
        .page{
          background:#fff;
          font-family:Arial;
          color:#111;
          overflow:hidden;
        }

        .header{
          text-align:center;
          margin-top:120px;
          padding:40px 20px;
        }

        .header h1{
          font-size:48px;
        }

        .header p{
          color:#666;
          max-width:600px;
          margin:auto;
        }

        .section{
          padding:50px 60px;
        }

        .section-header{
          display:flex;
          align-items:center;
          gap:15px;
          justify-content:space-between;
          margin-bottom:25px;
        }

        .section-header img{
          height:80px;
        }

        .section-header h2{
          font-size:26px;
          margin:0;
        }

        .carousel{
          position:relative;
          display:flex;
          align-items:center;
          overflow:hidden;
        }

        .track{
          display:flex;
          gap:20px;
          width:100%;
        }

        .card{
          flex:1;
          background:#fff;
          border:1px solid #eee;
          border-radius:16px;
          padding:22px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
        }

        .stars{
          color:#fbbf24;
          margin-bottom:10px;
        }

        .card p{
          color:#444;
          min-height:60px;
        }

        .bottom{
          margin-top:15px;
          font-size:12px;
          color:#9ca3af;
        }

        .nav{
          position:absolute;
          width:40px;
          height:40px;
          border-radius:50%;
          border:1px solid #ddd;
          background:#fff;
          cursor:pointer;
          z-index:2;
        }

        .left{ left:-10px; }
        .right{ right:-10px; }

        @media(max-width:768px){
          .section{ padding:30px; }

          .header h1{
            font-size:32px;
          }

          .section-header{
            flex-direction:row;
            justify-content:flex-start;
          }

          .section-header img{
            height:50px;
          }

          .section-header h2{
            font-size:20px;
          }
        }
      `}</style>

      <Footer/>
      <WhatsappFloat/>
      <WhatsappPopup/>
      <BackToTop/>
    </div>
  );
}