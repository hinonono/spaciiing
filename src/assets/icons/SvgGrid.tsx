import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgGrid: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18,3H6c-1.66,0-3,1.34-3,3v12c0,1.66,1.34,3,3,3h12c1.66,0,3-1.34,3-3V6c0-1.66-1.34-3-3-3ZM20,6v2.5h-4.5v-4.5h2.5c1.1,0,2,.9,2,2ZM9.5,14.5v-5h5v5h-5ZM14.5,15.5v4.5h-5v-4.5h5ZM8.5,14.5h-4.5v-5h4.5v5ZM9.5,8.5v-4.5h5v4.5h-5ZM15.5,9.5h4.5v5h-4.5v-5ZM6,4h2.5v4.5h-4.5v-2.5c0-1.1.9-2,2-2ZM4,18v-2.5h4.5v4.5h-2.5c-1.1,0-2-.9-2-2ZM18,20h-2.5v-4.5h4.5v2.5c0,1.1-.9,2-2,2Z" />
    </svg>
  );
};

export default SvgGrid;
