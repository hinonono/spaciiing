import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgChevronLeft: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path className="cls-1" d="M8.2,22c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l8.29-8.29L7.5,3.71c-.39-.39-.39-1.02,0-1.41s1.02-.39,1.41,0l9,9c.39.39.39,1.02,0,1.41l-9,9c-.2.2-.45.29-.71.29Z"/>
    </svg>
  );
};

export default SvgChevronLeft;
