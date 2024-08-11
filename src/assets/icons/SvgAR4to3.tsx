import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgAR4to3: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path className="cls-1" d="M19,6c.83,0,1.5.67,1.5,1.5v9c0,.83-.67,1.5-1.5,1.5H5c-.83,0-1.5-.67-1.5-1.5V7.5c0-.83.67-1.5,1.5-1.5h14M19,4.5H5c-1.66,0-3,1.34-3,3v9c0,1.66,1.34,3,3,3h14c1.66,0,3-1.34,3-3V7.5c0-1.66-1.34-3-3-3h0Z"/>
    </svg>
  );
};

export default SvgAR4to3;
