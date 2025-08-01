import React from "react";
import "./AnimatedBackground.css"; 

const AnimatedBackground = () => {
  return (
    <div className="background">
      {Array.from({ length: 8 }).map((_, index) => (
        <span key={index} className="ball"></span>
      ))}
    </div>
  );
};

export default AnimatedBackground;
