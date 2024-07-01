import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgCross: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M13.06,12l6.01-6.01c.29-.29.29-.77,0-1.06s-.77-.29-1.06,0l-6.01,6.01-6.01-6.01c-.29-.29-.77-.29-1.06,0s-.29.77,0,1.06l6.01,6.01-6.01,6.01c-.29.29-.29.77,0,1.06.15.15.34.22.53.22s.38-.07.53-.22l6.01-6.01,6.01,6.01c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77,0-1.06l-6.01-6.01Z"
      />
    </svg>
  );
};

export default SvgCross;
