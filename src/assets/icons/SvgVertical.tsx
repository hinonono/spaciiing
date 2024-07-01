import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgVertical: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
       <path className="cls-1" d="M15.72,16.47l-2.97,2.97V4.57l2.97,2.97c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77,0-1.06l-4.25-4.25c-.29-.29-.77-.29-1.06,0l-4.25,4.25c-.29.29-.29.77,0,1.06s.77.29,1.06,0l2.97-2.97v14.87l-2.97-2.97c-.29-.29-.77-.29-1.06,0s-.29.77,0,1.06l4.25,4.25c.15.15.34.22.53.22s.38-.07.53-.22l4.25-4.25c.29-.29.29-.77,0-1.06s-.77-.29-1.06,0Z"/>
    </svg>
  );
};

export default SvgVertical;
