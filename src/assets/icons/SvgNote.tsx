import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgNote: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <defs>
        <filter id="drop-shadow-1" x="0" y="1" width="24" height="24" filterUnits="userSpaceOnUse">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur result="blur" stdDeviation="1" />
          <feFlood floodColor="#000" floodOpacity=".75" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
        <linearGradient id="linear-gradient" x1="12" y1="3" x2="12" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fdde73" />
          <stop offset="1" stopColor="#fbc842" />
        </linearGradient>
        <linearGradient id="linear-gradient-2" x1="12" y1="9" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#f3f3f3" />
        </linearGradient>
      </defs>
      <g style={{ filter: "url(#drop-shadow-1)" }}>
        <path d="M21,7c0-2.21-1.79-4-4-4H7c-2.21,0-4,1.79-4,4v2h18v-2Z" style={{ fill: "url(#linear-gradient)" }} />
        <path d="M3,9v8c0,2.21,1.79,4,4,4h10c2.21,0,4-1.79,4-4v-8H3Z" style={{ fill: "url(#linear-gradient-2)" }} />
      </g>
      <rect x="6" y="11" width="12" height="2" rx="1" ry="1" style={{ fill: "#ccc" }} />
      <rect x="6" y="15" width="12" height="2" rx="1" ry="1" style={{ fill: "#e2e2e2" }} />
    </svg>
  );
};

export default SvgNote;
