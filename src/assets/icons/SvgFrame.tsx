import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgFrame: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M21 7.5v-1h-3.5V3h-1v3.5h-9V3h-1v3.5H3v1h3.5v9H3v1h3.5V21h1v-3.5h9V21h1v-3.5H21v-1h-3.5v-9H21Zm-4.5 9h-9v-9h9v9Z" />
    </svg>
  );
};

export default SvgFrame;
