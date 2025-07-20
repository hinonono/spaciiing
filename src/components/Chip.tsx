import React from 'react';

interface ChipProps {
  label: string;
  highlighted: boolean;
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  highlighted,
  onClick,
  disabled,
  id,
}) => {

  return (
    <button
      className={`button chip ${highlighted === true ? "highlighted" : ""}`}
      id={id}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Chip;
