import React from 'react';

interface ColorThumbnailViewProps {
  color: string;
  opacity: number;
  size: number;
  type: "rounded" | "square";
  extraClassName?: string;
}

const ColorThumbnailView: React.FC<ColorThumbnailViewProps> = ({
  color,
  opacity,
  size,
  type,
  extraClassName,
}) => {

  return (
    <div
      className={`color-thumbnail color-thumbnail-${type} ${extraClassName}`}
      style={{
        background: color,
        opacity: opacity,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
    </div>
  );
};

export default ColorThumbnailView;
