import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgCornerRadius: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M3 7v2h1.5V7A2.5 2.5 0 0 1 7 4.5h2V3H7C4.79 3 3 4.79 3 7Zm14-4h-2v1.5h2A2.5 2.5 0 0 1 19.5 7v2H21V7c0-2.21-1.79-4-4-4ZM4.5 17v-2H3v2c0 2.21 1.79 4 4 4h2v-1.5H7A2.5 2.5 0 0 1 4.5 17Zm15 0a2.5 2.5 0 0 1-2.5 2.5h-2V21h2c2.21 0 4-1.79 4-4v-2h-1.5v2Z" />
    </svg>
  );
};

export default SvgCornerRadius;
