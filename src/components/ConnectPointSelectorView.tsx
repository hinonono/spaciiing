import React from 'react';
import { ConnectPointPosition } from '../types/ArrowCreator';

interface ConnectPointSelectorViewProps {
  // The current selected connection point for the start item
  startItemConnectPointPosition: ConnectPointPosition;
  // Function to update the selected connection point for the start item
  setStartItemConnectPointPosition: (position: ConnectPointPosition) => void;
  // The current selected connection point for the end item
  endItemConnectPointPosition: ConnectPointPosition;
  // Function to update the selected connection point for the end item
  setEndItemConnectPointPosition: (position: ConnectPointPosition) => void;
}

// Available connection point positions around each item
const connectPoints: ConnectPointPosition[] = [
  "topCenter",
  "bottomCenter",
  "centerLeft",
  "centerRight"
];

const ConnectPointSelectorView: React.FC<ConnectPointSelectorViewProps> = ({
  startItemConnectPointPosition,
  setStartItemConnectPointPosition,
  endItemConnectPointPosition,
  setEndItemConnectPointPosition
}) => {
  return (
    <div className="connect-point-container">
      {/* Render two connectable items: one for start and one for end */}
      {[true, false].map((isStart) => (
        <div key={isStart ? "start" : "end"} className="connect-item drop-shadow-3">
          {/* Render four connection points around each item */}
          {connectPoints.map((position) => (
            <div
              key={position}
              className={`drop-shadow-1 connect-point ${position} ${(isStart ? startItemConnectPointPosition : endItemConnectPointPosition) === position ? "selected" : ""
                }`}
              onClick={() =>
                isStart
                  ? setStartItemConnectPointPosition(position) // Set selected connect point for start item
                  : setEndItemConnectPointPosition(position) // Set selected connect point for end item
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ConnectPointSelectorView;
