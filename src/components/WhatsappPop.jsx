import { useEffect, useRef, useState } from "react";

function WhatsappPopup() {
  const [visible, setVisible] = useState(false);
  const popupTimeout = useRef(null);
  const showAgainTimeout = useRef(null);

  const showPopup = () => {
    setVisible(true);

    popupTimeout.current = setTimeout(() => {
      setVisible(false);

      showAgainTimeout.current = setTimeout(() => {
        showPopup();
      }, 10000);
    }, 15000);
  };

  const closePopup = () => {
    setVisible(false);
    clearTimeout(popupTimeout.current);

    showAgainTimeout.current = setTimeout(() => {
      showPopup();
    }, 10000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      showPopup();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(popupTimeout.current);
      clearTimeout(showAgainTimeout.current);
    };
  }, []);

  return (
    <>
      {visible && (
        <div id="whatsapp-popup-main-container">
          <span onClick={closePopup}>X</span>

          <div id="whatsapp-icon-container">
            <img
              src="https://img.icons8.com/?size=100&id=16733&format=png&color=1c732c"
              loading="lazy"
              alt="whatsapp-icon"
            />
            <a
              href="https://api.whatsapp.com/send?phone=447463151997"
              target="_blank"
              rel="noopener noreferrer"
            >
              +447463151997
            </a>
          </div>

          <p>
            Please send your query or requirements in detail via whatsapp,
            and we will respond shortly. <br />
            Thank you!
          </p>
        </div>
      )}
    </>
  );
}

export default WhatsappPopup;