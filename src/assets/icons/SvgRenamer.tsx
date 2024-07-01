import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgRenamer: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <polygon
        className="cls-1"
        points="18 3 13 3 13 4 15 4 15 20 13 20 13 21 18 21 18 20 16 20 16 4 18 4 18 3 18 3"
      />
      <g>
        <path
          className="cls-1"
          d="M14,16H3.83c-.46,0-.83-.37-.83-.83v-6.35c0-.46.37-.83.83-.83h10.17v-1H3.83c-1.01,0-1.83.82-1.83,1.83v6.35c0,1.01.82,1.83,1.83,1.83h10.17v-1Z"
        />
        <path
          className="cls-1"
          d="M20.17,7h-3.17v1h3.17c.46,0,.83.37.83.83v6.35c0,.46-.37.83-.83.83h-3.17v1h3.17c1.01,0,1.83-.82,1.83-1.83v-6.35c0-1.01-.82-1.83-1.83-1.83Z"
        />
      </g>
    </svg>
  );
};

export default SvgRenamer;
