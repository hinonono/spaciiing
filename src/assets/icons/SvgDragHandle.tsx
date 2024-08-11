import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgDragHandle: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle className="cls-1" cx="8" cy="4" r="2" />
      <circle className="cls-1" cx="16" cy="4" r="2" />
      <circle className="cls-1" cx="8" cy="12" r="2" />
      <circle className="cls-1" cx="16" cy="12" r="2" />
      <circle className="cls-1" cx="8" cy="20" r="2" />
      <circle className="cls-1" cx="16" cy="20" r="2" />
    </svg>
  );
};

export default SvgDragHandle;
