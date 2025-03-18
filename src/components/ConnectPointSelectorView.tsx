import React from 'react';
import { ConnectPointPosition, RectangleSegmentType } from '../types/ArrowCreator';
import { Direction } from '../types/General';

interface ConnectPointSelectorViewProps {
  direction: Direction,
  sourceItemConnectPointPosition: ConnectPointPosition;
  setSourceItemConnectPointPosition: (position: ConnectPointPosition) => void;
  targetItemConnectPointPosition: ConnectPointPosition;
  setTargetItemConnectPointPosition: (position: ConnectPointPosition) => void;
}

// Available connection point positions around each item
const connectPoints: ConnectPointPosition[] = [
  RectangleSegmentType.TopCenter,
  RectangleSegmentType.BottomCenter,
  RectangleSegmentType.MiddleLeft,
  RectangleSegmentType.MiddleRight
];

const ConnectPointSelectorView: React.FC<ConnectPointSelectorViewProps> = ({
  direction,
  sourceItemConnectPointPosition,
  setSourceItemConnectPointPosition,
  targetItemConnectPointPosition,
  setTargetItemConnectPointPosition
}) => {
  return (
    <div className={`connect-point-container ${direction}`}>
      {/* Render two connectable items: one for start and one for end */}
      {[true, false].map((isStart) => (
        <div key={isStart ? "start" : "end"} className="connect-item drop-shadow-3">
          {/* Render four connection points around each item */}
          {connectPoints.map((position) => (
            <div
              key={position}
              className={`drop-shadow-1 connect-point ${position} ${(isStart ? sourceItemConnectPointPosition : targetItemConnectPointPosition) === position ? "selected" : ""
                }`}
              onClick={() =>
                isStart
                  ? setSourceItemConnectPointPosition(position) // Set selected connect point for start item
                  : setTargetItemConnectPointPosition(position) // Set selected connect point for end item
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ConnectPointSelectorView;
