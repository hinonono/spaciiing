import React, { useEffect, useState } from "react";
import { ExternalMessage } from "./types/Messages/ExternalMessage";
import SubscriptionModal from "./view/SubscriptionModal";
import TabBar from "./components/TabBar";
import { Module } from "./types/Module";
import {
  activeTabController,
  tabWillEndController,
} from "./module-frontend/tabController";
import { messageController } from "./module-frontend/messageController";

// #region Actual File Content
const CoreLayer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Module>("Spaciiing");
  const [prevTab, setPrevTab] = useState<Module | null>(null);

  // #region Handle External Message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage) {
        const message = event.data.pluginMessage
          .pluginMessage as ExternalMessage;

        messageController(message);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // #region WillEnd
  useEffect(() => {
    // 處理生命週期即將結束的頁籤進行相關動作
    tabWillEndController(prevTab, activeTab);

    // 處理當前活躍中的頁籤以進行初始化
    activeTabController(activeTab);

    setPrevTab(activeTab);
  }, [activeTab]);

  // #region JSX Elements
  return (
    <div className="App">
      <SubscriptionModal />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default CoreLayer;
