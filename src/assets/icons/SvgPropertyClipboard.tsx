import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgPropertyClipboard: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M8.87,6h6.27c.48,0,.87-.39.87-.87v-1.27c0-.48-.39-.87-.87-.87h-6.27c-.48,0-.87.39-.87.87v1.27c0,.48.39.87.87.87ZM9,4h6v1h-6v-1Z"
      />
      <rect className="cls-1" x="8" y="10" width="8" height="1" />
      <rect className="cls-1" x="8" y="13" width="6" height="1" />
      <rect className="cls-1" x="8" y="16" width="6" height="1" />
      <path
        className="cls-1"
        d="M17,4v1c.55,0,1,.45,1,1v13c0,.55-.45,1-1,1H7c-.55,0-1-.45-1-1V6c0-.55.45-1,1-1v-1c-1.1,0-2,.9-2,2v13c0,1.1.9,2,2,2h10c1.1,0,2-.9,2-2V6c0-1.1-.9-2-2-2Z"
      />
    </svg>
  );
};

export default SvgPropertyClipboard;
