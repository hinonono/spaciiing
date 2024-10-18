import React from "react";
import { capitalizeWords } from "../module/util";

interface FigmaButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary" | "grain" | "special";
  buttonHeight?: "small" | "medium" | "large" | "xlarge";
  fontSize?: "xsmall" | "small" | "large" | "xlarge";
  title: string;
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  svg?: React.ReactNode;
  hasTopBottomMargin?: boolean;
  hasMargin?: boolean;
  showChevron?: boolean;
}

const FigmaButton: React.FC<FigmaButtonProps> = ({
  buttonType = "primary",
  buttonHeight = "medium",
  fontSize = "xsmall",
  title,
  id,
  onClick,
  disabled = false,
  svg,
  hasTopBottomMargin = true,
  hasMargin = true,
  showChevron = false,
}) => {
  return (
    <div className="flex">
      <button
        className={`button button--${buttonType} font-size-${fontSize} button-height-${buttonHeight} ${
          hasTopBottomMargin === false && "disable-mtmb"
        } ${hasMargin === false && "margin-0"}`}
        id={id}
        onClick={onClick}
        disabled={disabled}
      >
        {svg && <div className="icon-24">{svg}</div>}
        <span>{capitalizeWords(title)}</span>
        {showChevron && <span className="chevron-left"></span>}
      </button>
    </div>
  );
};

export default FigmaButton;
