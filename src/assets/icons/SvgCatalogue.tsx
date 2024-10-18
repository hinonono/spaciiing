import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgCatalogue: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M9,4c.55,0,1,.45,1,1v4c0,.55-.45,1-1,1h-4c-.55,0-1-.45-1-1v-4c0-.55.45-1,1-1h4M9,3h-4c-1.1,0-2,.9-2,2v4c0,1.1.9,2,2,2h4c1.1,0,2-.9,2-2v-4c0-1.1-.9-2-2-2h0Z" />
      <path d="M9,14c.55,0,1,.45,1,1v4c0,.55-.45,1-1,1h-4c-.55,0-1-.45-1-1v-4c0-.55.45-1,1-1h4M9,13h-4c-1.1,0-2,.9-2,2v4c0,1.1.9,2,2,2h4c1.1,0,2-.9,2-2v-4c0-1.1-.9-2-2-2h0Z" />
      <rect x="13" y="5" width="8" height="1" />
      <rect x="13" y="8" width="5" height="1" />
      <rect x="13" y="15" width="8" height="1" />
      <rect x="13" y="18" width="5" height="1" />
    </svg>
  );
};

export default SvgCatalogue;
