import React from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { capitalizeWords } from "../module/util";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import { MessageLocalization } from "../types/Messages/MessageLocalization";
import * as licenseManagementFrontEnd from "../module-frontend/licenseManagementFrontEnd";

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
        <div>
          <h3>{t("settings:moduleName")}</h3>
          <SectionTitle title={t("settings:preferredLanguage")} />
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
        <div className="mt-large">
          <h3>{t("license:subscriptionSectionTitle")}</h3>
          <div className="grid">
            {licenseManagement.tier == "PAID" ? (
              <div className="membership-block pro">
                <p className="color--secondary">{t("license:currentPlan")}</p>
                <span>
                  {licenseManagement.tier === "PAID"
                    ? t("license:paid")
                    : t("license:free")}
                  {licenseManagement.recurrence != undefined ? (
                    <div>({capitalizeWords(licenseManagement.recurrence)})</div>
                  ) : null}
                </span>
              </div>
            ) : (
              <div className="membership-block">
                <p className="color--secondary">{t("license:currenTier")}</p>
                <span>{t("license:free")}</span>
              </div>
            )}
            <div className="membership-block">
              <p className="color--secondary">{t("license:licenseStatus")}</p>
              <span>
                {licenseManagement.isLicenseActive == true
                  ? t("license:licenseActive")
                  : t("license:licenseInactive")}
              </span>
            </div>
          </div>
          <div className="mt-xxsmall">
            <span className="note">{t("license:licenseNote")}</span>
          </div>

          <div className="mt-xsmall">
            <FigmaButton
              buttonType="secondary"
              title={t("license:activateLicense")}
              onClick={() => {
                setShowCTSubscribe(true);
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
                onClick={paymentsUtil.navigateToPurchasePage}
              />
            )}
          </div>
        </div>
        <div className="mt-large">
          <h3>{t("settings:about")}</h3>
          <div className="grid">
            <div className="membership-block">
              <p className="color--secondary">{t("settings:version")}</p>
              <span>17</span>
            </div>
            <div className="membership-block">
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
          </div>
          <div className="mt-xxsmall"></div>
          <span className="note">
            {t("settings:forBugReportOrSupport")}{" "}
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
