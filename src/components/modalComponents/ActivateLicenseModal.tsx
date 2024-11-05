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

interface ActivateLicenseModalProps {}

const ActivateLicenseModal: React.FC<ActivateLicenseModalProps> = () => {
  const { t } = useTranslation(["license", "term"]);
  const {
    showActivateModal,
    setShowActivateModal,
    setLicenseManagement,
    licenseManagement
  } = useAppContext();

  const isOnline = useNetworkStatus();
  const [licenseKey, setLicenseKey] = useState("");
  const [response, setResponse] = useState<LicenseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (licenseKey == "") {
      setError(t("license:licenseKeyCannotBeNull"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response: LicenseResponse = await paymentsUtil.verifyLicenseKey(
        licenseKey
      );

      if (response.success === true) {
        let newLicense: LicenseManagement = {
          tier: "UNKNOWN",
          recurrence: "",
          isLicenseActive: false,
          licenseKey: licenseKey,
          sessionExpiredAt: util.addHours(new Date(), 3).toUTCString(),
        };

        newLicense = handleSubscriptionStatus(
          response as LicenseResponseSuccess,
          newLicense
        );

        const message: MessageLicenseManagement = {
          license: newLicense,
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
        setLicenseManagement(newLicense);

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

  return (
    <Modal show={showActivateModal} handleClose={handleCloseActivateModal}>
      <div>
        <h3>{t("license:enterLicenseKey")}</h3>
        <p>{t("license:enterLicenseKeyDescription")}</p>
        {isOnline ? (
          <div>
            <div className="mt-xxsmall">
              <SectionTitle title={t("module:licenseKey")} />
              <div className="width-100">
                <textarea
                  className="textarea"
                  rows={1}
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder={t("license:enterYourLicenseKeyHere")}
                />
                {response && (
                  <div>
                    <pre className="note success">
                      {t("license:activateSuccess")}
                    </pre>
                  </div>
                )}
                {error && (
                  <div>
                    <pre className="note error">{error}</pre>
                  </div>
                )}
              </div>
            </div>
            {!response && (
              <div className="mt-xsmall">
                <FigmaButton
                  title={t("license:proceed")}
                  onClick={handleVerify}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>{t("license:offlineNotification")}</p>
          </div>
        )}
        <div>
          {!response ? (
            licenseManagement.tier != "PAID" ? null : null
          ) : (
            <FigmaButton
              title={t("license:finish")}
              onClick={handleCloseActivateModal}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ActivateLicenseModal;
