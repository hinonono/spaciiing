import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgDrawArrows: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M21.85,11.83l-5.16-5.16c-.2-.2-.51-.2-.71,0s-.2.51,0,.71l4.3,4.3H7v-3.08c0-.78-.63-1.41-1.41-1.41h-2.17c-.78,0-1.41.63-1.41,1.41v7.17c0,.78.63,1.41,1.41,1.41h2.17c.78,0,1.41-.63,1.41-1.41v-3.09h13.3l-4.31,4.31c-.2.2-.2.51,0,.71.1.1.23.15.35.15s.26-.05.35-.15l5.16-5.16c.09-.09.15-.22.15-.35s-.05-.26-.15-.35ZM6,15.77c0,.23-.19.41-.41.41h-2.17c-.23,0-.41-.19-.41-.41v-7.17c0-.23.19-.41.41-.41h2.17c.23,0,.41.19.41.41v7.17Z" />
    </svg>
  );
};

export default SvgDrawArrows;
