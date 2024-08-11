import React, { useState } from "react";
import { TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import {
  MessageVirtualProfileSingleValue,
  MessageVirtualProfileWholeObject,
} from "../types/Message";
import { VirtualProfile, VirtualProfileGroup } from "../types/VirtualProfile";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import VirtualProfileNew from "./VirtualProfileNew";

const VirtualProfile: React.FC = () => {
  const { t } = useTranslation(["module"]);
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const { virtualProfileGroups } = useAppContext();
  const [previousVirtualProfile, setPreviousVirtualProfile] = useState<
    VirtualProfileGroup[] | null
  >(null);

  const applyVirtualProfile = (key: string, value: string) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageVirtualProfileSingleValue = {
      module: "VirtualProfile",
      direction: "Inner",
      virtualProfileKey: key,
      virtualProfileValue: value,
      phase: "Actual",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const saveVirtualProfile = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageVirtualProfileWholeObject = {
      // virtualProfile: virtualProfile,
      virtualProfileGroups: virtualProfileGroups,
      module: "VirtualProfile",
      phase: "WillEnd",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );

    setPreviousVirtualProfile(virtualProfileGroups);
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
        isProFeature={true}
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
