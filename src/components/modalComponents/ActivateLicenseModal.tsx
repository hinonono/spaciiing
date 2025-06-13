import React, { useState } from "react";
import Modal from "../Modal";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../AppProvider";
import SectionTitle from "../SectionTitle";
import useNetworkStatus from "../../useNetworkStatus";
import {
  LicenseManagement,
  LicenseResponse,
  LicenseResponseSuccess,
} from "../../types/LicenseManagement";
import FigmaButton from "../FigmaButton";
import * as paymentsUtil from "../../module-frontend/paymentsUtil";
import * as util from "../../module/util";
import { MessageLicenseManagement } from "../../types/Messages/MessageLicenseManagement";
import { handleSubscriptionStatus } from "../../module-frontend/licenseManagementFrontEnd";
import axios from "axios";
import { LicenseKeyInput } from "..";

interface ActivateLicenseModalProps { }

const ActivateLicenseModal: React.FC<ActivateLicenseModalProps> = () => {
  const { t } = useTranslation(["license", "term"]);
  const {
    showActivateModal,
    setShowActivateModal,
    setLicenseManagement,
    licenseManagement,
  } = useAppContext();

  const isOnline = useNetworkStatus();
  const [licenseKey, setLicenseKey] = useState("");
  const [response, setResponse] = useState<LicenseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!licenseKey) {
      setError(t("license:licenseKeyCannotBeNull"));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response: LicenseResponse = await paymentsUtil.verifyLicenseKey(
        licenseKey
      );

      if (response.success) {
        const newLicense: LicenseManagement = {
          tier: "UNKNOWN",
          recurrence: "",
          isLicenseActive: false,
          licenseKey,
          sessionExpiredAt: util.addHours(new Date(), 3).toUTCString(),
        };

        const updatedLicense = handleSubscriptionStatus(
          response as LicenseResponseSuccess,
          newLicense
        );

        const message: MessageLicenseManagement = {
          license: updatedLicense,
          module: "LicenseManagement",
          phase: "Actual",
          direction: "Inner",
          action: "UPDATE",
        };
        parent.postMessage(
          {
            pluginMessage: message,
          },
          "*"
        );

        setLicenseManagement(updatedLicense);
        console.log("License is successfully activated.");
      }

      setResponse(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("🥹");

        // Access the response data if the error is from Axios
        setError(error.response ? error.response.data.message : error.message);
      } else if (error instanceof Error) {
        // Handle other types of errors
        console.log("💖");
        console.error(error.message);
        setError(t("license:activateInvalid"));
      } else {
        console.log("🍏");
        setError(t("license:activateUnknown"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseActivateModal = () => {
    setShowActivateModal(false);
    setLicenseKey("");
    setError(null);
    setResponse(null);
  };

  const handleLicenseKeyChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setLicenseKey(value);
  };

  const renderActionButton = () =>
    !response ? (
      <FigmaButton
        title={t("license:proceed")}
        onClick={handleVerify}
        disabled={loading}
      />
    ) : (
      <FigmaButton
        title={t("license:finish")}
        onClick={handleCloseActivateModal}
      />
    );

  return (
    <Modal show={showActivateModal} handleClose={handleCloseActivateModal}>
      <div>
        <h3>{t("license:enterLicenseKey")}</h3>
        <p>{t("license:enterLicenseKeyDescription")}</p>
        {isOnline ? (
          <>
            <LicenseKeyInput
              licenseKey={licenseKey}
              onChange={handleLicenseKeyChange}
              response={response}
              error={error}
            />
            <div className="mt-xsmall">
              {renderActionButton()}
            </div>
          </>
        ) : (
          <p>{t("license:offlineNotification")}</p>
        )}
      </div>
    </Modal>
  );
};

export default ActivateLicenseModal;
