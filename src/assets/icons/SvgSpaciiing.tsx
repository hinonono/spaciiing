import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgSpaciiing: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M15.57,7h-7.14c-.79,0-1.43.64-1.43,1.43v7.14c0,.79.64,1.43,1.43,1.43h7.14c.79,0,1.43-.64,1.43-1.43v-7.14c0-.79-.64-1.43-1.43-1.43ZM16,15.57c0,.24-.19.43-.43.43h-7.14c-.24,0-.43-.19-.43-.43v-7.14c0-.24.19-.43.43-.43h7.14c.24,0,.43.19.43.43v7.14Z"
      />
      <path
        className="cls-1"
        d="M9.5,4h5.01c.27,0,.5-.22.5-.5s-.22-.5-.5-.5h-5.01c-.27,0-.5.22-.5.5s.22.5.5.5Z"
      />
      <path
        className="cls-1"
        d="M14.5,20h-5c-.28,0-.5.22-.5.5s.22.5.5.5h5c.28,0,.5-.22.5-.5s-.22-.5-.5-.5Z"
      />
      <path
        className="cls-1"
        d="M20.5,9.01c-.28,0-.5.22-.5.5v5c0,.28.22.5.5.5s.5-.22.5-.5v-5c0-.28-.22-.5-.5-.5Z"
      />
      <path
        className="cls-1"
        d="M3.5,9c-.28,0-.5.22-.5.5v5c0,.28.22.5.5.5s.5-.22.5-.5v-5c0-.28-.22-.5-.5-.5Z"
      />
    </svg>
  );
};

export default SvgSpaciiing;
