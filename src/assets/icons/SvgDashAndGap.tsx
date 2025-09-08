import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgDashAndGap: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="m2.986 20.305 2.122-2.121.707.707-2.122 2.121zM7.68 17.02l-.71-.71 3.74-3.74.71.71-3.74 3.74Zm5.61-5.6-.71-.71 3.74-3.74.71.71-3.74 3.74ZM18.186 5.11l2.122-2.122.707.707-2.122 2.121z" />
    </svg>
  );
};

export default SvgDashAndGap;
