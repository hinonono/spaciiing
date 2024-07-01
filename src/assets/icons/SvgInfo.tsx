import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgInfo: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2ZM12,20.5c-4.69,0-8.5-3.81-8.5-8.5S7.31,3.5,12,3.5s8.5,3.81,8.5,8.5-3.81,8.5-8.5,8.5Z"
      />
      <circle className="cls-1" cx="12" cy="7.5" r="1" />
      <rect className="cls-1" x="11.25" y="10.25" width="1.5" height="7" />
    </svg>
  );
};

export default SvgInfo;
