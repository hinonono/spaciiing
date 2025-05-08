import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgText: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M3 3v4.25h1.5V4.5h6.75v15.02H9v1.5h6v-1.5h-2.25V4.5h6.75V7H21V3H3z" />
    </svg>
  );
};

export default SvgText;
