import React, { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

// Create a Context to share the selected value and setter function
const SegmentedControlContext = createContext({
  inputName: "",
  selectedOption: "",
  onChange: (value: string) => { },
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

  // Derive options by iterating over children to extract their value props
  const values = React.Children.toArray(children)
    .map((child) => {
      if (React.isValidElement(child) && 'value' in child.props) {
        return child.props.value;
      }
      return null;
    })
    .filter((v): v is string => v !== null);

  const selectedIndex = values.indexOf(value);

  return (
    <SegmentedControlContext.Provider
      value={{ selectedOption: value, onChange, t, inputName }}
    >
      <div className="custom-segmented-control" style={{ position: "relative" }}>
        <motion.div
          initial={false}
          animate={{
            // left: `calc(${selectedIndex} * ((100% - 8px) / ${values.length})`,
            left: `calc(4px + ${selectedIndex} * ((100% - 8px) / ${values.length}))`,
            width: `calc((100% - 8px) / ${values.length})`,
          }}
          transition={{ type: "spring", duration: 0.5, ease: "easeInOut", bounce: 0 }}
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            bottom: 4,
          }}
          className="highlight-box"
        />
        {children}
      </div>
    </SegmentedControlContext.Provider>
  );
};

interface OptionProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  translatable?: boolean;
}

// Define the Child Component (Option)
SegmentedControl.Option = ({
  value,
  label,
  icon,
  translatable = true,
}: OptionProps) => {
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
      <label
        htmlFor={`option-${inputName}_${value}`}
        style={{ position: "relative", zIndex: 1 }}
      >
        {icon && <div className="icon-24">{icon}</div>}
        {translatable ? t(label) : label}
      </label>
    </React.Fragment>
  );
};

export default SegmentedControl;
