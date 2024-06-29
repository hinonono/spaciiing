import React, { useState } from "react";
import Modal from "../components/Modal";
import useNetworkStatus from "../useNetworkStatus";
import { FigmaButton, SectionTitle } from "../components";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import * as util from "../module/util";
import { LicenseManagement } from "../types/LicenseManagement";
import { MessageLicenseManagement } from "../types/Message";
import { useAppContext } from "../AppProvider";
import axios from "axios";

const SubscriptionModal: React.FC = () => {
  const isOnline = useNetworkStatus();
  // 金鑰輸入
  const [licenseKey, setLicenseKey] = useState("");
  // API 呼叫
  const [response, setResponse] = useState(null);
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
      setError("License key cannot be null.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await paymentsUtil.verifyLicenseKey(licenseKey);

      if (response.success === true) {
        const expiredTime = util.addHours(new Date(), 3).toUTCString();
        const newLicense: LicenseManagement = {
          tier: "PAID",
          recurrence: response.recurrence,
          isLicenseActive: true,
          licenseKey: licenseKey,
          sessionExpiredAt: expiredTime,
        };

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
        setError("The provided license key is invalid.");
      } else {
        console.log("🍏");
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCTSubscribe = () => {
    setShowCTSubscribe(false);
    setLicenseKey("");
  };
  const handleOpenActivateModal = () => {
    setShowCTSubscribe(true);
    setShowActivateModal(true);
  };
  const handleCloseActivateModal = () => {
    setShowActivateModal(false);
    setLicenseKey("");
  };

  return (
    <Modal show={showCTSubscribe} handleClose={handleCloseCTSubscribe}>
      <div>
        {showActivateModal && (
          <div>
            <h3>Enter your license key</h3>
            <p>
              You can find your license key in Gumroad page or the email inbox
              you filled in during purchase.
            </p>
            {isOnline ? (
              <div>
                <div className="mt-xxsmall">
                  <SectionTitle title={"License key"} />
                  <div className="width-100">
                    <textarea
                      className="textarea"
                      rows={1}
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      placeholder="Enter your license key here"
                    />
                    {response && (
                      <div>
                        <pre className="note success">
                          You have activate your license successfully.
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
                      title={"Proceed"}
                      onClick={handleVerify}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>
                  You are offline. Please check your internet connection before
                  procceed license verification.
                </p>
              </div>
            )}
            <div>
              {!response ? (
                <FigmaButton
                  buttonType="secondary"
                  title={"Back"}
                  onClick={handleCloseActivateModal}
                />
              ) : (
                <FigmaButton
                  title={"Finish"}
                  onClick={handleCloseCTSubscribe}
                />
              )}
            </div>
          </div>
        )}
        {!showActivateModal && (
          <div>
            <div className="badge">PRO</div>
            <h2>Subscribe to unlock all features.</h2>
            <p>
              You have no active license. Upgrade to unlock virtual profile,
              selection filter, variable editor and more features!
            </p>
            <div className="mt-xsmall">
              <FigmaButton
                title={"Subscribe Now"}
                onClick={paymentsUtil.navigateToPurchasePage}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Activate License"}
                onClick={handleOpenActivateModal}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
