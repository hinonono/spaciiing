import React from 'react';

interface ButtonIcon24Props {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  svg: React.ReactNode;
  disabled?: boolean;
}

const ButtonIcon24: React.FC<ButtonIcon24Props> = ({
  svg,
  disabled = false,
  onClick
}) => {

  return (
    <button
      className="button-reset margin-0 width-auto"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="icon-24 icon-hover">{svg}</div>
    </button >
  );
};

export default ButtonIcon24;
