import React, { useId } from "react";
import { SVGprops } from "../../types/SVGprops";

const SvgTag: React.FC<SVGprops> = ({ color }) => {
  const idA = useId();
  const idB = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="tag"
      viewBox="0 0 24 24"
    >
      <defs>
        <filter
          id={idA}
          width={24}
          height={14}
          x={0}
          y={1}
          data-name="drop-shadow-1"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy={1} />
          <feGaussianBlur
            result="uuid-0da361c5-a852-4050-8a48-4c51ba0a81f9"
            stdDeviation={1}
          />
          <feFlood floodColor="#000" floodOpacity={0.75} />
          <feComposite
            in2="uuid-0da361c5-a852-4050-8a48-4c51ba0a81f9"
            operator="in"
          />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter
          id={idB}
          width={24}
          height={14}
          x={0}
          y={11}
          data-name="drop-shadow-2"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy={1} />
          <feGaussianBlur
            result="uuid-43d5c546-5e5e-492d-9a7d-3966f691f615"
            stdDeviation={1}
          />
          <feFlood floodColor="#000" floodOpacity={0.75} />
          <feComposite
            in2="uuid-43d5c546-5e5e-492d-9a7d-3966f691f615"
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
        <path d="M7,10.5c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5h10c1.93,0,3.5,1.57,3.5,3.5s-1.57,3.5-3.5,3.5H7Z" style={{ fill: "#e0e7ff" }} />
        <path d="M17,4c1.65,0,3,1.35,3,3s-1.35,3-3,3H7c-1.65,0-3-1.35-3-3s1.35-3,3-3h10M17,3H7c-2.21,0-4,1.79-4,4s1.79,4,4,4h10c2.21,0,4-1.79,4-4s-1.79-4-4-4h0Z" style={{ fill: "#4f39f6" }} />
      </g>
      <g
        style={{
          filter: `url(#${idB})`,
        }}
      >
        <path d="M7,20.5c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5h10c1.93,0,3.5,1.57,3.5,3.5s-1.57,3.5-3.5,3.5H7Z" style={{ fill: "#fce7f3" }} />
        <path d="M17,14c1.65,0,3,1.35,3,3s-1.35,3-3,3H7c-1.65,0-3-1.35-3-3s1.35-3,3-3h10M17,13H7c-2.21,0-4,1.79-4,4s1.79,4,4,4h10c2.21,0,4-1.79,4-4s-1.79-4-4-4h0Z" style={{ fill: "#e60076" }} />
      </g>
      <circle cx="7.5" cy="7" r="1.5" style={{ fill: "#4f39f6" }} />
      <circle cx="7.5" cy="17" r="1.5" style={{ fill: "#e60076" }} />
    </svg>
  );
};

export default SvgTag;
