import React, { useState } from "react";
import { TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import { VirtualProfileGroup } from "../types/VirtualProfile";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import VirtualProfileNew from "./VirtualProfileNew";
import {
  MessageVirtualProfileSingleValue,
} from "../types/Messages/MessageVirtualProfile";
import * as pluginConfig from "../pluginConfig.json";
import { MessageSaveSyncedResource } from "../types/Messages/MessageSaveSyncedResource";

const VirtualProfile: React.FC = () => {
  const { t } = useTranslation(["module"]);
  const { licenseManagement, setFreeUserDelayModalConfig } = useAppContext();

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const { runtimeSyncedResources } = useAppContext();
  const [previousVirtualProfile, setPreviousVirtualProfile] = useState<
    VirtualProfileGroup[] | null
  >(null);

  const applyVirtualProfile = (key: string, value: string, isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
          onProceed: () => applyVirtualProfile(key, value, true), // Re-invoke with the real call
        });
        return;
      }
    }

    // Real logic to apply the virtual profile
    const message: MessageVirtualProfileSingleValue = {
      module: "VirtualProfile",
      direction: "Inner",
      virtualProfileKey: key,
      virtualProfileValue: value,
      phase: "Actual",
    };

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  const saveVirtualProfile = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
          onProceed: () => saveVirtualProfile(true), // Re-invoke with the real call
        });
        return;
      }
    }

    const message: MessageSaveSyncedResource = {
      shouldSaveSyncedReources: true,
      shouldSaveSyncedReourcesType: "virtualProfiles",
      syncedResources: runtimeSyncedResources,
      module: "General",
      phase: "Actual",
      direction: "Inner"
    }

    parent.postMessage({ pluginMessage: message, }, "*");

    setPreviousVirtualProfile(runtimeSyncedResources.virtualProfiles);
  };

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>{t("module:moduleVirtualProfile")}</h3>
          <p>{t("module:moduleVirtualProfileDesc")}</p>
          <h4>{t("module:editAndApply")}</h4>
          <p>{t("module:editAndApplyDesc")}</p>
          <h4>{t("module:saveYourChange")}</h4>
          <p>{t("module:saveYourChangeDesc")}</p>
        </div>
      </Modal>
      <TitleBar
        title={t("module:moduleVirtualProfile")}
        onClick={handleOpenExplanationModal}
      />
      <div className="content">
        <VirtualProfileNew
          applyVirtualProfile={applyVirtualProfile}
          saveVirtualProfile={saveVirtualProfile}
          previousVirtualProfile={previousVirtualProfile}
        />
      </div>
    </div>
  );
};

export default VirtualProfile;
