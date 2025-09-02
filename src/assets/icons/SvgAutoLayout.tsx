import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgAutoLayout: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19 4H5c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm1 5c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v3ZM13 13H5c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2Zm1 5c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v3Z" />
    </svg>
  );
};

export default SvgAutoLayout;
