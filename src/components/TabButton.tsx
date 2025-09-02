import React from "react";
import { Module } from "../types/Module";
import { SVGprops } from "../types/SVGprops";

interface TabButtonProps {
  activeTab: Module;
  tabName: Module;
  onClick: () => void;
  // setActiveTab: (value: React.SetStateAction<Module>) => void;
  SvgComponent: React.FC<SVGprops>;
}

const TabButton: React.FC<TabButtonProps> = ({
  activeTab,
  tabName,
  // setActiveTab,
  onClick,
  SvgComponent,
}) => {
  return (
    <div className="tab">
      <button
        className={activeTab === tabName ? "active" : ""}
        onClick={onClick}
      >
        <div className="icon-28">
          <SvgComponent
            color={
              activeTab === tabName ? "var(--white)" : "var(--tab-bar-icon)"
            }
          />
        </div>
      </button>
    </div>
  );
};

export default TabButton;
