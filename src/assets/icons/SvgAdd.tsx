import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgAdd: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path className="cls-1" d="M20.25,11.25h-7.5V3.75c0-.41-.34-.75-.75-.75s-.75.34-.75.75v7.5H3.75c-.41,0-.75.34-.75.75s.34.75.75.75h7.5v7.5c0,.41.34.75.75.75s.75-.34.75-.75v-7.5h7.5c.41,0,.75-.34.75-.75s-.34-.75-.75-.75Z"/>
    </svg>
  );
};

export default SvgAdd;
