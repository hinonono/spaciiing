import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgSelectionFilter: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
     <path className="cls-1" d="M19,3H5c-1.1,0-2,.9-2,2,0,1.92.76,3.76,2.12,5.12l4.73,4.73c.09.09.15.22.15.35v4.17c0,.58.48,1,1,1,.15,0,.3-.03.45-.11l2-1c.34-.17.55-.52.55-.89v-3.17c0-.13.05-.26.15-.35l4.73-4.73c1.36-1.36,2.12-3.2,2.12-5.12,0-1.1-.9-2-2-2ZM13.44,14.15c-.28.28-.44.66-.44,1.06v3.17l-2,1v-4.17c0-.4-.16-.78-.44-1.06l-4.73-4.73c-.13-.13-.26-.27-.38-.41h13.09c-.12.14-.24.28-.38.41l-4.73,4.73ZM19.23,8H4.77c-.5-.91-.77-1.93-.77-3,0-.55.45-1,1-1h14c.55,0,1,.45,1,1,0,1.07-.27,2.09-.77,3Z"/>
    </svg>
  );
};

export default SvgSelectionFilter;
