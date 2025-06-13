import React, { useId } from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgSection: React.FC<SVGprops> = ({ color }) => {
  const idA = useId();

  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-name="title"
        viewBox="0 0 24 24"
      >
        <defs>
          <filter
            id={idA}
            width={26}
            height={22}
            x={-1}
            y={2}
            data-name="drop-shadow-1"
            filterUnits="userSpaceOnUse"
          >
            <feOffset dy={1} />
            <feGaussianBlur
              result="uuid-ae4046da-98d5-4e6e-9061-820cd4d6812d"
              stdDeviation={1}
            />
            <feFlood floodColor="#000" floodOpacity={0.75} />
            <feComposite
              in2="uuid-ae4046da-98d5-4e6e-9061-820cd4d6812d"
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
          <path d="M2 4h20v10H2z" />
          <path
            d="M2.5 13.5h19v6h-19z"
            style={{
              fill: "#fff",
            }}
          />
          <path d="M21 14v5H3v-5h18m1-1H2v7h20v-7Z" />
        </g>
        <rect
          width={13}
          height={3}
          x={5}
          y={8}
          rx={0.5}
          ry={0.5}
          style={{
            fill: "#474747",
          }}
        />
      </svg>
    </svg>
  );
};

export default SvgSection;
