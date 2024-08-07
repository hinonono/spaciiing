import React from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgDefaultStyleLibrary: React.FC<SVGprops> = ({ color }) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className="cls-1"
        d="M20.94,5.33c-2.85-.83-5.98-.78-8.8.13-.09.03-.19.03-.28,0-2.82-.91-5.94-.96-8.8-.13-.62.18-1.06.77-1.06,1.44v11.19c0,.46.21.9.58,1.18.36.28.83.38,1.27.27,2.52-.63,5.25-.54,7.7.26.15.05.3.07.45.07s.3-.02.45-.07c2.45-.79,5.19-.89,7.7-.26.45.11.91.01,1.28-.27.37-.29.58-.72.58-1.18V6.77c0-.67-.44-1.26-1.06-1.44ZM7.26,17.99c-1.22,0-2.45.15-3.65.45-.2.05-.35-.03-.42-.09-.12-.09-.19-.24-.19-.39V6.77c0-.22.14-.42.34-.48,2.65-.77,5.54-.73,8.16.11v12.22c-1.38-.41-2.81-.63-4.24-.63ZM21,17.96c0,.16-.07.3-.19.39-.07.05-.22.14-.42.09-2.61-.65-5.33-.59-7.89.17V6.39c2.62-.84,5.51-.88,8.16-.11.2.06.34.26.34.48v11.19Z"
      />
    </svg>
  );
};

export default SvgDefaultStyleLibrary;
