import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgVector: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20.25 10.25c-.79 0-1.45.53-1.67 1.25H15V10c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1.5H5.42A1.746 1.746 0 0 0 2 12a1.746 1.746 0 0 0 3.42.5H9V14c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1.5h3.58A1.746 1.746 0 0 0 22 12c0-.97-.78-1.75-1.75-1.75Zm-16.5 2.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75ZM14 14h-4v-4h4v4Zm6.25-1.25c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75Z" />
    </svg>
  );
};

export default SvgVector;
