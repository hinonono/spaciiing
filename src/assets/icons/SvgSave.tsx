import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgSave: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M16.78,12.47c-.29-.29-.77-.29-1.06,0l-2.97,2.97V2h-1.5v13.44l-2.97-2.97c-.29-.29-.77-.29-1.06,0s-.29.77,0,1.06l4.25,4.25c.15.15.34.22.53.22s.38-.07.53-.22l4.25-4.25c.29-.29.29-.77,0-1.06Z" />
      <path d="M17,6h-2.75v1.5h2.75c1.38,0,2.5,1.12,2.5,2.5v8c0,1.38-1.12,2.5-2.5,2.5H7c-1.38,0-2.5-1.12-2.5-2.5v-8c0-1.38,1.12-2.5,2.5-2.5h2.75v-1.5h-2.75c-2.21,0-4,1.79-4,4v8c0,2.21,1.79,4,4,4h10c2.21,0,4-1.79,4-4v-8c0-2.21-1.79-4-4-4Z" />
    </svg>
  );
};

export default SvgSave;
