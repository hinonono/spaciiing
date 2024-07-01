import React from "react";
import { TitleBar, FigmaButton } from "../components";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { capitalizeWords } from "../module/util";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";

const Setting: React.FC = () => {
  // Context
  const { licenseManagement, setShowActivateModal, setShowCTSubscribe } =
    useAppContext();

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <TitleBar title="Settings" showInfoIcon={false} />
      <div className="content">
        <h2>{t("welcome")}</h2>
        <FigmaButton title={"English"} onClick={() => changeLanguage("en")} />
        <FigmaButton title={"Japanese"} onClick={() => changeLanguage("jp")} />
        <div>
          <h3>Your subscription</h3>
          <div className="grid">
            {licenseManagement.tier == "PAID" ? (
              <div className="membership-block pro">
                <p className="color--secondary">Current Plan</p>
                <span>
                  {licenseManagement.tier}
                  {licenseManagement.recurrence ? (
                    <div>
                      {" "}
                      ({capitalizeWords(licenseManagement.recurrence)})
                    </div>
                  ) : null}
                </span>
              </div>
            ) : (
              <div className="membership-block">
                <p className="color--secondary">Current Tier</p>
                <span>{licenseManagement.tier}</span>
              </div>
            )}
            <div className="membership-block">
              <p className="color--secondary">License Status</p>
              <span>
                {licenseManagement.isLicenseActive == true
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
          </div>
          <div className="mt-xxsmall">
            <span className="note">
              The license status indicates whether PRO features are accessible.
              In the absence of an internet connection during the license
              verification process, the status will be set to false, even if you
              are enrolled in the PRO tier.
            </span>
          </div>

          <div className="mt-xsmall">
            <FigmaButton
              buttonType="secondary"
              title={"Activate License"}
              onClick={() => {
                setShowCTSubscribe(true);
                setShowActivateModal(true);
              }}
            />
            {licenseManagement.tier != "PAID" && (
              <FigmaButton
                title={"Subscribe Now"}
                onClick={paymentsUtil.navigateToPurchasePage}
              />
            )}
          </div>
        </div>
        <div className="mt-small">
          <h3>About</h3>
          <div className="grid">
            <div className="membership-block">
              <p className="color--secondary">Version</p>
              <span>6</span>
            </div>
          </div>
          <div className="mt-xxsmall"></div>
          <span className="note">
            For bug report or support, please contact{" "}
            <a href="mailto:contact@hsiehchengyi.com" target="_blank">
              contact@hsiehchengyi.com
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Setting;
