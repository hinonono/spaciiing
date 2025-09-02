import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgImage: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18 3H6C4.34 3 3 4.34 3 6v12c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3ZM6 20c-1.1 0-2-.9-2-2v-.97l3.1-4.18c.38-.51.97-.81 1.61-.81s1.23.29 1.61.81L15.63 20H6Zm14-2c0 1.1-.9 2-2 2h-1.14l-5.75-7.75c-.6-.81-1.5-1.21-2.41-1.21s-1.81.4-2.41 1.21l-2.3 3.1V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12Z" />
      <path d="M15 6.5a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5Zm0 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Z" />
    </svg>
  );
};

export default SvgImage;
