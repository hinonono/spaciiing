import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgAR2to3: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M15.67,3.5c.83,0,1.5.67,1.5,1.5v14c0,.83-.67,1.5-1.5,1.5h-7.33c-.83,0-1.5-.67-1.5-1.5V5c0-.83.67-1.5,1.5-1.5h7.33M15.67,2h-7.33c-1.66,0-3,1.34-3,3v14c0,1.66,1.34,3,3,3h7.33c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3h0Z"
      />
    </svg>
  );
};

export default SvgAR2to3;
