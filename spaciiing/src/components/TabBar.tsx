import React from "react";
import { ModuleType } from "../types/Message";
import {
  SvgDefaultStyleLibrary,
  SvgPropertyClipboard,
  SvgRenamer,
  SvgSelectionFilter,
  SvgSetting,
  SvgShortcut,
  SvgSpaciiing,
  SvgVariableEditor,
  SvgVirtualProfile,
} from "../assets/icons";
import TabButton from "./TabButton";
import {
  Instantiater,
  Memorizer,
  Renamer,
  SelectionFilter,
  Setting,
  Shortcut,
  Spaciiing,
  VariableEditor,
  VirtualProfile,
} from "../view";

interface TabBarProps {
  activeTab: ModuleType;
  setActiveTab: (value: React.SetStateAction<ModuleType>) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "Spaciiing":
        return <Spaciiing />;
      case "VariableEditor":
        return <VariableEditor />;
      case "Memorizer":
        return <Memorizer />;
      case "Renamer":
        return <Renamer />;
      // case "LoremGenerator":
      //   return <LoremGenerator />;
      case "Instantiater":
        return <Instantiater />;
      case "Shortcut":
        return <Shortcut />;
      case "VirtualProfile":
        return <VirtualProfile />;
      case "SelectionFilter":
        return <SelectionFilter />;
      case "PluginSetting":
        return <Setting />;
      default:
        return;
    }
  };

  return (
    <div className="tabs">
      <div className="tab-bar hide-scrollbar-horizontal">
        <TabButton
          activeTab={activeTab}
          tabName="Spaciiing"
          setActiveTab={setActiveTab}
          SvgComponent={SvgSpaciiing}
        />
        <TabButton
          activeTab={activeTab}
          tabName="Memorizer"
          setActiveTab={setActiveTab}
          SvgComponent={SvgPropertyClipboard}
        />
        <TabButton
          activeTab={activeTab}
          tabName="VirtualProfile"
          setActiveTab={setActiveTab}
          SvgComponent={SvgVirtualProfile}
        />
        <TabButton
          activeTab={activeTab}
          tabName="SelectionFilter"
          setActiveTab={setActiveTab}
          SvgComponent={SvgSelectionFilter}
        />
        <TabButton
          activeTab={activeTab}
          tabName="Renamer"
          setActiveTab={setActiveTab}
          SvgComponent={SvgRenamer}
        />
        <TabButton
          activeTab={activeTab}
          tabName="Shortcut"
          setActiveTab={setActiveTab}
          SvgComponent={SvgShortcut}
        />
        {/* <TabButton
          activeTab={activeTab}
          tabName="LoremGenerator"
          setActiveTab={setActiveTab}
          SvgComponent={SvgLoremGenerator}
        /> */}
        <TabButton
          activeTab={activeTab}
          tabName="VariableEditor"
          setActiveTab={setActiveTab}
          SvgComponent={SvgVariableEditor}
        />
        <TabButton
          activeTab={activeTab}
          tabName="Instantiater"
          setActiveTab={setActiveTab}
          SvgComponent={SvgDefaultStyleLibrary}
        />
        <TabButton
          activeTab={activeTab}
          tabName="PluginSetting"
          setActiveTab={setActiveTab}
          SvgComponent={SvgSetting}
        />
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default TabBar;
