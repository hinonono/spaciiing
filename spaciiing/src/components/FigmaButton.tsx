import React from "react";
import { capitalizeWords } from "../module/util";

interface FigmaButtonProps {
  buttonType?: "primary" | "secondary" | "tertiary";
  title: string;
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const FigmaButton: React.FC<FigmaButtonProps> = ({
  buttonType = "primary",
  title,
  id,
  onClick,
  disabled = false,
}) => {
  return (
    <div className="flex">
      <button
        className={`button button--${buttonType}`}
        id={id}
        onClick={onClick}
        disabled={disabled}
      >
        {capitalizeWords(title)}
      </button>
    </div>
  );
};

export default FigmaButton;
