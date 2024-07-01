import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgHorizontal: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path className="cls-1" d="M7.53,15.72l-2.97-2.97h14.87l-2.97,2.97c-.15.15-.22.34-.22.53s.07.38.22.53c.29.29.77.29,1.06,0l4.25-4.25c.29-.29.29-.77,0-1.06l-4.25-4.25c-.29-.29-.77-.29-1.06,0s-.29.77,0,1.06l2.97,2.97H4.56l2.97-2.97c.29-.29.29-.77,0-1.06s-.77-.29-1.06,0l-4.25,4.25c-.15.15-.22.34-.22.53s.07.38.22.53l4.25,4.25c.29.29.77.29,1.06,0s.29-.77,0-1.06Z"/>
    </svg>
  );
};

export default SvgHorizontal;
