import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgAspectRatioHelper: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M20,4H4c-1.1,0-2,.9-2,2v12c0,1.1.9,2,2,2h16c1.1,0,2-.9,2-2V6c0-1.1-.9-2-2-2ZM4,19c-.55,0-1-.45-1-1v-9h10v10H4ZM14,19v-10h2.45c.3,0,.55.25.55.55v9.45h-3ZM21,18c0,.55-.45,1-1,1h-2v-9.45c0-.86-.69-1.55-1.55-1.55H3v-2c0-.55.45-1,1-1h16c.55,0,1,.45,1,1v12Z"
      />
    </svg>
  );
};

export default SvgAspectRatioHelper;
