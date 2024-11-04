import React, { useState } from "react";
import Modal from "../components/Modal";
import useNetworkStatus from "../useNetworkStatus";
import { FigmaButton, SectionTitle } from "../components";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import * as util from "../module/util";
import {
  LicenseManagement,
  LicenseResponse,
  LicenseResponseSuccess,
} from "../types/LicenseManagement";
import { useAppContext } from "../AppProvider";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { handleSubscriptionStatus } from "../module-frontend/licenseManagementFrontEnd";
import { MessageLicenseManagement } from "../types/Messages/MessageLicenseManagement";
import FreeTrialGraph from "../components/FreeTrialGraph";
import SubscriptionPlanBlock from "../components/SubscriptionPlanBlock";

const SubscriptionModal: React.FC = () => {
  const { licenseManagement } = useAppContext();
  const { t } = useTranslation(["license", "term"]);

  const isOnline = useNetworkStatus();
  // 金鑰輸入
  const [licenseKey, setLicenseKey] = useState("");
  // API 呼叫
  const [response, setResponse] = useState<LicenseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    showCTSubscribe,
    showActivateModal,
    setShowCTSubscribe,
    setShowActivateModal,
    setLicenseManagement,
  } = useAppContext();

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

  const handleCloseCTSubscribe = () => {
    setShowCTSubscribe(false);
    setShowActivateModal(false);
    setError(null);
    setLicenseKey("");
    setResponse(null);
  };
  const handleOpenActivateModal = () => {
    setShowCTSubscribe(true);
    setShowActivateModal(true);
  };
  const handleCloseActivateModal = () => {
    setShowActivateModal(false);
    setLicenseKey("");
    setError(null);
    setResponse(null);
  };

  return (
    <Modal show={showCTSubscribe} handleClose={handleCloseCTSubscribe}>
      <div>
        {showActivateModal && (
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
                  onClick={handleCloseCTSubscribe}
                />
              )}
            </div>
          </div>
        )}
        {!showActivateModal && (
          <div className="free-trial-modal">
            <h2>{t("license:trySevenDaysFree")}</h2>
            {/* Plan block */}
            <div>
              <SubscriptionPlanBlock
                plan={"yearly"}
                additionalClass={[
                  "subscription-block",
                  "subscription-block-yearly",
                ]}
              />
            </div>
            <div className="mt-xxsmall">
              <SubscriptionPlanBlock
                plan={"monthly"}
                additionalClass={["subscription-block"]}
              />
            </div>
            <span className="note mt-xxxsmall">
              {t("license:noHiddenFees")}
            </span>
            <div id="free-trial-faq" className="mt-xsmall">
              <h3>{t("license:freeTrialWorks")}</h3>
              <FreeTrialGraph />
              <h3 className="mt-xsmall">
                {t("license:supportAndSubscriptionInfo")}
              </h3>
              <p>{t("license:supportAndSubscriptionInfoAnswer")}</p>
              <h3 className="mt-xsmall">
                {t("license:howRecurringPaymentsWork")}
              </h3>
              <p>
                {t("license:howRecurringPaymentsWorkAnswer")}
                {t("license:noHiddenFees")}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
