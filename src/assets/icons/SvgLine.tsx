import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgLine: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M2.992 20.301 20.309 2.984l.707.707L3.7 21.01z" />
    </svg>
  );
};

export default SvgLine;
