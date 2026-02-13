import React from "react";

interface IconButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary" | "grain" | "special" | "danger" | "secondary--danger";
  buttonHeight?: "small" | "medium" | "large" | "xlarge";
  iconSize?: "20" | "24";
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  svg: React.ReactNode;
  hasTopBottomMargin?: boolean;
  hasMargin?: boolean;
  additionalClass?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  buttonType = "primary",
  buttonHeight = "medium",
  iconSize = "24",
  id,
  onClick,
  disabled = false,
  svg,
  hasTopBottomMargin = true,
  hasMargin = true,
  additionalClass
}) => {
  return (
    <div className="flex flex-justify-center align-items-center">
      <button
        className={`button button-icon button--${buttonType} button-height-${buttonHeight} ${hasTopBottomMargin === false && "disable-mtmb"
          } ${hasMargin === false && "margin-0"} ${additionalClass}`}
        id={id}
        onClick={onClick}
        disabled={disabled}
      >
        <div className={`icon-${iconSize}`}>{svg}</div>
      </button>
    </div>
  );
};

export default IconButton;
