import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgInstance: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="m21.36 10.46-7.82-7.82C13.11 2.21 12.56 2 12 2s-1.12.21-1.54.64l-7.82 7.82c-.85.85-.85 2.23 0 3.08l7.82 7.82c.43.43.98.64 1.54.64s1.12-.21 1.54-.64l7.82-7.82c.85-.85.85-2.23 0-3.08Zm-.71 2.37-7.82 7.82c-.22.22-.52.35-.83.35s-.61-.12-.83-.35l-7.82-7.82c-.46-.46-.46-1.21 0-1.67l7.82-7.82c.22-.22.52-.35.83-.35s.61.12.83.35l7.82 7.82c.46.46.46 1.21 0 1.67Z" />
    </svg>
  );
};

export default SvgInstance;
