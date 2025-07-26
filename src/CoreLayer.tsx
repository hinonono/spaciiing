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
import { SavedClickCounter } from "./components";

// #region Actual File Content
const CoreLayer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Module>("Spaciiing");
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

  useEffect(() => {
    if (appContext.triggeredCommand === "updateCatalogueDesc") {
      setActiveTab("Shortcut");
    } else if (appContext.triggeredCommand === "drawArrows") {
      setActiveTab("ArrowCreator");
    }
  }, [appContext.triggeredCommand])

  // #region WillEnd
  useEffect(() => {
    tabController(activeTab, prevTab, appContext);

    setPrevTab(activeTab);
  }, [activeTab]);

  const isDevelopment =
    process.env.REACT_APP_ENV === "development" ||
    process.env.REACT_APP_ENV === "developmentfree";

  // #region JSX Elements
  return (
    <div className="App">
      {isDevelopment && (
        <div className="banner banner--development-mode">
          開發者模式
        </div>
      )}
      {/* <SavedClickCounter /> */}
      <SubscriptionModal />
      <ActivateLicenseModal />
      <FreeUserDelayModal />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default CoreLayer;
