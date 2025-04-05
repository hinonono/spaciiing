import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgMinus: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M20.25,11.25H3.75c-.41,0-.75.34-.75.75s.34.75.75.75h16.5c.41,0,.75-.34.75-.75s-.34-.75-.75-.75Z"/>
    </svg>
  );
};

export default SvgMinus;
