import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgCornerRadius: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6,21c-.41,0-.75-.34-.75-.75v-7.25c0-4.27,3.48-7.75,7.75-7.75h7.25c.41,0,.75.34.75.75s-.34.75-.75.75h-7.25c-3.45,0-6.25,2.8-6.25,6.25v7.25c0,.41-.34.75-.75.75Z" />
    </svg>
  );
};

export default SvgCornerRadius;
