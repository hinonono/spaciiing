import React, { ReactNode } from 'react';

interface CYCheckboxProps {
  label: string | ReactNode,
  checked: boolean,
  onChange: (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => void
  labelKey?: string,
  labelAdditionClass?: string
  spanAddtionClass?: string
  value?: string
}

const CYCheckbox: React.FC<CYCheckboxProps> = ({
  label,
  checked,
  onChange,
  labelKey,
  labelAdditionClass,
  spanAddtionClass,
  value
}) => {

  return (
    <label
      key={labelKey}
      className={`container ${labelAdditionClass ? labelAdditionClass : ""}`}
    >
      {label}
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className={`checkmark ${spanAddtionClass ? spanAddtionClass : ""}`}></span>
    </label>
  );
};

export default CYCheckbox;
