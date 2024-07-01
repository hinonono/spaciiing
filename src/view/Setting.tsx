import React from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { capitalizeWords } from "../module/util";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import { MessageLocalization } from "../types/Message";

const Setting: React.FC = () => {
  // Context
  const { licenseManagement, setShowActivateModal, setShowCTSubscribe } =
    useAppContext();

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
            <option value="en">English</option>
            <option value="jp">日本語</option>
            <option value="zh">繁體中文</option>
          </select>
        </div>
        <div className="mt-small">
          <h3>{t("license:subscriptionSectionTitle")}</h3>
          <div className="grid">
            {licenseManagement.tier == "PAID" ? (
              <div className="membership-block pro">
                <p className="color--secondary">{t("license:currentPlan")}</p>
                <span>
                  {licenseManagement.tier === "PAID"
                    ? t("license:paid")
                    : t("license:free")}
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
            {licenseManagement.tier != "PAID" && (
              <FigmaButton
                title={t("license:subscribeNow")}
                onClick={paymentsUtil.navigateToPurchasePage}
              />
            )}
          </div>
        </div>
        <div className="mt-small">
          <h3>{t("settings:about")}</h3>
          <div className="grid">
            <div className="membership-block">
              <p className="color--secondary">{t("settings:version")}</p>
              <span>6</span>
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
