import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgAR3to4: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M16.5,3.5c.83,0,1.5.67,1.5,1.5v14c0,.83-.67,1.5-1.5,1.5H7.5c-.83,0-1.5-.67-1.5-1.5V5c0-.83.67-1.5,1.5-1.5h9M16.5,2H7.5c-1.66,0-3,1.34-3,3v14c0,1.66,1.34,3,3,3h9c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3h0Z"
      />
    </svg>
  );
};

export default SvgAR3to4;
