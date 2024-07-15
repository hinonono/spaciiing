import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgAR1to1: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path className="cls-1" d="M18,4.5c.83,0,1.5.67,1.5,1.5v12c0,.83-.67,1.5-1.5,1.5H6c-.83,0-1.5-.67-1.5-1.5V6c0-.83.67-1.5,1.5-1.5h12M18,3H6c-1.66,0-3,1.34-3,3v12c0,1.66,1.34,3,3,3h12c1.66,0,3-1.34,3-3V6c0-1.66-1.34-3-3-3h0Z"/>
    </svg>
  );
};

export default SvgAR1to1;
