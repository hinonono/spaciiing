import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgExternalLink: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <line
        x1="20.12"
        y1="3.88"
        x2={10}
        y2={14}
        style={{
          fill: "none",
          stroke: color,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "1.5px",
        }}
      />
      <polyline
        points="20.25 9.76 20.25 3.75 14.24 3.75"
        style={{
          fill: "none",
          stroke: color,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
        }}
      />
      <path
        d="M11.78,5.5h-5.03c-1.66,0-3,1.34-3,3v8.75c0,1.66,1.34,3,3,3h8.75c1.66,0,3-1.34,3-3v-5.03"
        style={{
          fill: "none",
          stroke: color,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.42px",
        }}
      />
    </svg>
  );
};

export default SvgExternalLink;
