import React from "react";

interface IconButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary" | "grain" | "special" | "danger" | "secondary--danger";
  buttonHeight?: "small" | "medium" | "large" | "xlarge";
  fontSize?: "xsmall" | "small" | "large" | "xlarge";
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
  fontSize = "xsmall",
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
        className={`button button-icon button--${buttonType} font-size-${fontSize} button-height-${buttonHeight} ${hasTopBottomMargin === false && "disable-mtmb"
          } ${hasMargin === false && "margin-0"} ${additionalClass}`}
        id={id}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="icon-24">{svg}</div>
      </button>
    </div>
  );
};

export default IconButton;
