import React, { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

// Create a Context to share the selected value and setter function
const SegmentedControlContext = createContext({
  inputName: "",
  selectedOption: "",
  onChange: (value: string) => {},
  t: (key: string) => key,
});

interface SegmentedControlProps {
  inputName: string;
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}

// Define the SegmentedControl component with an Option property
const SegmentedControl: React.FC<SegmentedControlProps> & {
  Option: React.FC<OptionProps>;
} = ({ value, onChange, children, inputName }) => {
  const { t } = useTranslation();

  return (
    <SegmentedControlContext.Provider
      value={{ selectedOption: value, onChange, t, inputName }}
    >
      <div className="custom-segmented-control">{children}</div>
    </SegmentedControlContext.Provider>
  );
};

interface OptionProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

// Define the Child Component (Option)
SegmentedControl.Option = ({ value, label, icon }: OptionProps) => {
  const { inputName, selectedOption, onChange, t } = useContext(
    SegmentedControlContext
  );

  return (
    <React.Fragment>
      <input
        type="radio"
        name={inputName}
        id={`option-${inputName}_${value}`}
        value={value}
        checked={selectedOption === value}
        onChange={() => onChange(value)}
      />
      <label htmlFor={`option-${inputName}_${value}`}>
        {icon && <div className="icon-24">{icon}</div>}
        {t(label)}
      </label>
    </React.Fragment>
  );
};

export default SegmentedControl;
