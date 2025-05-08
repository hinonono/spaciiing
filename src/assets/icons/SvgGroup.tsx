import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgGroup: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M4 18c0 1.1.9 2 2 2h2.25v1h-2.4A3 3 0 0 1 3 18v-2.25h1V18Zm10.25 3h-4.5v-1h4.5v1ZM21 18c0 1.66-1.34 3-3 3h-2.25v-1H18c1.1 0 2-.9 2-2v-2.25h1V18ZM4 14.25H3v-4.5h1v4.5Zm17 0h-1v-4.5h1v4.5ZM8.25 4H6c-1.1 0-2 .9-2 2v2.25H3V6c0-1.66 1.34-3 3-3h2.25v1ZM18 3c1.66 0 3 1.34 3 3v2.25h-1V6c0-1.1-.9-2-2-2h-2.25V3H18Zm-3.75 1h-4.5V3h4.5v1Z" />
    </svg>
  );
};

export default SvgGroup;
