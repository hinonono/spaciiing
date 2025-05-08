import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgPolygon: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 4.05c.73 0 1.38.38 1.74 1.01l6.82 11.93c.36.63.36 1.37 0 2-.36.62-1.01 1-1.73 1H5.18c-.72 0-1.37-.37-1.73-1-.36-.62-.36-1.37 0-2l6.82-11.93c.36-.63 1.01-1.01 1.74-1.01m-.01-1c-1.01 0-2.03.5-2.6 1.51L2.58 16.49c-1.14 2 .3 4.49 2.6 4.49h13.63c2.3 0 3.75-2.49 2.6-4.49L14.59 4.56a2.968 2.968 0 0 0-2.6-1.51Z" />
    </svg>
  );
};

export default SvgPolygon;
