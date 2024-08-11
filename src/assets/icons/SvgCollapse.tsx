import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgCollapse: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path className="cls-1" d="M13.25,13.25h-6.5c-.41,0-.75.34-.75.75s.34.75.75.75h6.5c.41,0,.75-.34.75-.75s-.34-.75-.75-.75Z"/>
      <path className="cls-1" d="M18,3h-8c-1.66,0-3,1.34-3,3v1h-1c-1.66,0-3,1.34-3,3v8c0,1.66,1.34,3,3,3h8c1.66,0,3-1.34,3-3v-1h1c1.66,0,3-1.34,3-3V6c0-1.66-1.34-3-3-3ZM15.5,18c0,.83-.67,1.5-1.5,1.5H6c-.83,0-1.5-.67-1.5-1.5v-8c0-.83.67-1.5,1.5-1.5h8c.83,0,1.5.67,1.5,1.5v8ZM19.5,14c0,.83-.67,1.5-1.5,1.5h-1v-5.5c0-1.66-1.34-3-3-3h-5.5v-1c0-.83.67-1.5,1.5-1.5h8c.83,0,1.5.67,1.5,1.5v8Z"/>
    </svg>
  );
};

export default SvgCollapse;
