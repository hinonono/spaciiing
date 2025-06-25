import React from 'react';

interface ProgressBarProps {
  progress: number,
  max: number,
  color?: string,
  background?: string,
  additionalClass?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  max,
  additionalClass,
  color = "var(--cy-purple-600)",
  background = "var(--figma-color-bg-secondary)"
}) => {

  const containerStyle = {
    width: "100%",
    backgroundColor: background,
    borderRadius: "6px",
    overflow: "hidden",
    height: `6px`,
  };

  const fillerStyle = {
    width: `${Math.min(progress / max * 100, 100)}%`,
    backgroundColor: color,
    height: "100%",
    transition: "width 0.3s ease-in-out",
  };

  return (
    <div style={containerStyle} className={additionalClass}>
      <div style={fillerStyle} />
    </div>
  );
};

export default ProgressBar;
