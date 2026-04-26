import React from 'react';

function WhatsappFloat() {
  const phoneNumber = "447463151997"; // apna number yahan daalo (without +)

  return (
    <div className="whatsapp-float">
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <img
          src="https://img.icons8.com/?size=100&id=AltfLkFSP7XN&format=png&color=000000"
          alt="WhatsApp"
        />
      </a>
    </div>
  );
}

export default WhatsappFloat;