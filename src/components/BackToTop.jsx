import React, { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <>
      <button className="backToTop" onClick={scrollTop}>
        ↑
      </button>

      <style>{`
        .backToTop{
          position:fixed;
          bottom:100px;
          right:35px;
          width:35px;
          height:35px;
          border-radius:50%;
          border:none;
          background:#6c2bd9; /* purple */
          color:#fff;
          font-size:18px;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 8px 20px rgba(0,0,0,0.2);
          transition:0.3s;
          z-index:999;
        }

        .backToTop:hover{
          transform:translateY(-4px);
          background:#5a21b6;
        }

        
      `}</style>
    </>
  );
}