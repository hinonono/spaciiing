import React, { useEffect, useState } from "react";
import { ExternalMessage } from "./types/Messages/ExternalMessage";
import SubscriptionModal from "./view/SubscriptionModal";
import TabBar from "./components/TabBar";
import { Module } from "./types/Module";
import { tabController } from "./module-frontend/tabController";
import { messageController } from "./module-frontend/messageController";
import { useAppContext } from "./AppProvider";
import { useTranslation } from "react-i18next";
import { ActivateLicenseModal, FreeUserDelayModal } from "./components/modalComponents";

// #region Actual File Content
const CoreLayer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Module>("Shortcut");
  const [prevTab, setPrevTab] = useState<Module | null>(null);

  const appContext = useAppContext();
  const { i18n } = useTranslation();

  // #region Handle External Message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage) {
        const message = event.data.pluginMessage
          .pluginMessage as ExternalMessage;

        messageController(message, appContext, i18n);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // #region WillEnd
  useEffect(() => {
    tabController(activeTab, prevTab, appContext);

    setPrevTab(activeTab);
  }, [activeTab]);
  
  // #region JSX Elements
  return (
    <div className="App">
      <SubscriptionModal />
      <ActivateLicenseModal />
      <FreeUserDelayModal/>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default CoreLayer;
