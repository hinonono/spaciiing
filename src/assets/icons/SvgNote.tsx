import React, { useId } from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgNote: React.FC<SVGprops> = ({ color }) => {
  const idA = useId();
  const idB = useId();
  const idC = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="note"
      viewBox="0 0 24 24"
      fill={color}
    >
      <defs>
        <linearGradient
          id={idB}
          x1={12}
          x2={12}
          y1={3}
          y2={9}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#fdde73" />
          <stop offset={1} stopColor="#fbc842" />
        </linearGradient>
        <linearGradient
          id={idC}
          x1={12}
          x2={12}
          y1={9}
          y2={21}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#fff" />
          <stop offset={1} stopColor="#f3f3f3" />
        </linearGradient>
        <filter
          id={idA}
          width={24}
          height={24}
          x={0}
          y={1}
          data-name="drop-shadow-1"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy={1} />
          <feGaussianBlur
            result="uuid-483b1030-6229-4235-a59d-4786e9a133c8"
            stdDeviation={1}
          />
          <feFlood floodColor="#000" floodOpacity={0.75} />
          <feComposite
            in2="uuid-483b1030-6229-4235-a59d-4786e9a133c8"
            operator="in"
          />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g
        style={{
          filter: `url(#${idA})`,
        }}
      >
        <path
          d="M21 7c0-2.21-1.79-4-4-4H7C4.79 3 3 4.79 3 7v2h18V7Z"
          style={{
            fill: `url(#${idB})`,
          }}
        />
        <path
          d="M3 9v8c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4V9H3Z"
          style={{
            fill: `url(#${idC})`,
          }}
        />
      </g>
      <rect
        width={12}
        height={2}
        x={6}
        y={11}
        rx={0.5}
        ry={0.5}
        style={{
          fill: "#ccc",
        }}
      />
      <rect
        width={12}
        height={2}
        x={6}
        y={15}
        rx={0.5}
        ry={0.5}
        style={{
          fill: "#ccc",
        }}
      />
    </svg>
  );
};

export default SvgNote;
