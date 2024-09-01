import React, { useEffect, useRef, useState } from "react";
import { Module } from "../types/Module";
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
  SvgAspectRatioHelper,
  SvgCatalogue,
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
  AspectRatioHelper,
  StyleIntroducer,
} from "../view";
import { useAppContext } from "../AppProvider";
import SaleBannerWrapper from "./SaleBannerWrapper";

interface TabBarProps {
  activeTab: Module;
  setActiveTab: (value: React.SetStateAction<Module>) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
  const isDevelopment = process.env.REACT_APP_ENV === "development";
  const { licenseManagement } = useAppContext();

  // Reference to the scrollable container element
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State to track if the user is currently dragging for horizontal scroll
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // State to store the initial X position when the drag starts
  const [startX, setStartX] = useState<number>(0);

  // State to store the initial scroll position when the drag starts
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  // Function to handle the mouse down event for initiating the drag
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollContainerRef.current) {
      // Calculate the initial X position relative to the scroll container
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      // Store the current scroll position
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Function to handle mouse move event for horizontal scrolling
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    // Calculate the new scroll position
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // The multiplier controls the scrolling speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      e.preventDefault(); // Prevent the default vertical scroll behavior
      scrollContainerRef.current.scrollLeft += e.deltaY; // Scroll horizontally
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", (e: WheelEvent) =>
        onWheel(e as unknown as React.WheelEvent)
      );
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", (e: WheelEvent) =>
          onWheel(e as unknown as React.WheelEvent)
        );
      }
    };
  }, []);

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
      case "AspectRatioHelper":
        return <AspectRatioHelper />;
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
      case "StyleIntroducer":
        return <StyleIntroducer />;
      default:
        return;
    }
  };

  return (
    <div className="tabs">
      {isDevelopment && <div className="banner banner--development-mode">現在正執行開發者模式</div>}
      <SaleBannerWrapper licenseManagement={licenseManagement} />
      <div
        className="tab-bar scroll-container hide-scrollbar-horizontal"
        ref={scrollContainerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
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
          tabName="AspectRatioHelper"
          setActiveTab={setActiveTab}
          SvgComponent={SvgAspectRatioHelper}
        />
        <TabButton
          activeTab={activeTab}
          tabName="Shortcut"
          setActiveTab={setActiveTab}
          SvgComponent={SvgShortcut}
        />
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
          tabName="StyleIntroducer"
          setActiveTab={setActiveTab}
          SvgComponent={SvgCatalogue}
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
