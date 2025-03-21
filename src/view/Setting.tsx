import React from "react";
import { TitleBar, FigmaButton } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import { MessageLocalization } from "../types/Messages/MessageLocalization";
import * as licenseManagementFrontEnd from "../module-frontend/licenseManagementFrontEnd";
import info from "../info.json";

const Setting: React.FC = () => {
  // Context
  const {
    licenseManagement,
    setLicenseManagement,
    setShowActivateModal,
    setShowCTSubscribe,
  } = useAppContext();

  const { t, i18n } = useTranslation(["common", "settings", "license"]);

  const handleLangChange = (event: { target: { value: string } }) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);

    const message: MessageLocalization = {
      lang: selectedLanguage,
      module: "Localization",
      phase: "Actual",
      direction: "Inner",
    };
    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  console.log(licenseManagement);

  return (
    <div>
      <TitleBar title={t("settings:moduleName")} showInfoIcon={false} />
      <div className="content">
        {/*  訂閱 */}
        <div>
          <h3>{t("license:subscriptionSectionTitle")}</h3>
          <div>
            {licenseManagement.tier == "PAID" ? (
              <div className="membership-block pro">
                <p className="color--secondary">{t("license:currenTier")}</p>
                <span>
                  {licenseManagement.recurrence === "monthly"
                    ? t("license:monthly")
                    : t("license:yearly")}
                </span>
              </div>
            ) : (
              <div className="membership-block">
                <p className="color--secondary">{t("license:currenTier")}</p>
                <span>{t("license:free")}</span>
              </div>
            )}
          </div>
          <div className="mt-xxsmall">
            {licenseManagement.tier !== "FREE" && (
              <span className="note">
                {t("license:licenseStatus")}:{" "}
                {licenseManagement.isLicenseActive == true
                  ? t("license:licenseActive")
                  : t("license:licenseInactive")}
              </span>
            )}
          </div>
          <div className="mt-xsmall grid">
            <FigmaButton
              buttonType="secondary"
              title={t("license:activateLicense")}
              onClick={() => {
                setShowActivateModal(true);
              }}
            />
            {licenseManagement.tier === "PAID" && (
              <FigmaButton
                title={t("license:eraseLicense")}
                buttonType="secondary"
                onClick={() => {
                  licenseManagementFrontEnd.eraseLicense(setLicenseManagement);
                }}
              />
            )}
            {licenseManagement.tier !== "PAID" && (
              <FigmaButton
                title={t("license:seeAllPlans")}
                buttonType="special"
                onClick={() => {
                  setShowCTSubscribe(true);
                }}
              />
            )}
          </div>
        </div>
        {/* 偏好語言 */}
        <div className="mt-large">
          <h3>{t("settings:preferredLanguage")}</h3>
          <select
            id="brand_select"
            className="custom-select"
            value={i18n.language} // current language
            onChange={handleLangChange}
          >
            <option value="enUS">English</option>
            <option value="jaJP">日本語</option>
            <option value="zhTW">繁體中文</option>
            <option value="zhCN">简体中文</option>
          </select>
        </div>
        {/* 關於本Plugin */}
        <div className="mt-large">
          <h3>{t("settings:about")}</h3>
          <div className="about-spaciiing">
            <div className="membership-block block1">
              <p className="color--secondary">Share Spaciiing on X(Twitter)</p>
              <span>
                <a
                  className="text-color-primary"
                  href="https://x.com/intent/post?url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Fplugin%2F1129646367083296027%2Fspaciiing"
                  target="_blank"
                >
                  Share
                </a>
              </span>
            </div>
            <div className="membership-block block1">
              <p className="color--secondary">{t("settings:version")}</p>
              <span>{info.version}</span>
            </div>
            <div className="membership-block block2">
              <p className="color--secondary">
                {t("settings:provideFeedback")}
              </p>
              <span>
                <a
                  className="text-color-primary"
                  href="https://forms.gle/jFgzJfs1nw259Kgk8"
                  target="_blank"
                >
                  {t("settings:feedbackForm")}
                </a>
              </span>
            </div>
            <div className="membership-block block3">
              <p className="color--secondary">
                {t("settings:forBugReportOrSupport")}
              </p>
              <span>
                <a
                  className="text-color-primary"
                  href="mailto:contact@hsiehchengyi.com"
                  target="_blank"
                >
                  contact@hsiehchengyi.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
