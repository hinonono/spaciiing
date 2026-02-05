import React, { useState } from "react";
import { TitleBar, FigmaButton, ProductivityDashboard, PreferredLanguageView } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import { MessageLocalization } from "../types/Messages/MessageLocalization";
import * as licenseManagementFrontEnd from "../module-frontend/licenseManagementFrontEnd";
import info from "../pluginConfig.json";
import { SvgEraser, SvgKey } from "../assets/icons";
import { EraseLicenseModal } from "../components/modalComponents";

const Setting: React.FC = () => {
  // Context
  const {
    licenseManagement,
    setLicenseManagement,
    setShowActivateModal,
    setShowCTSubscribe,
    editorPreference
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
    parent.postMessage({ pluginMessage: message, }, "*");
  };

  // 顏色至文字彈窗
  const [showEraseLicenseModal, setShowEraseLicenseModal] = useState(false);
  const handleOpenEraseLicenseModal = () => setShowEraseLicenseModal(true)
  const handleCloseEraseLicenseModal = () => setShowEraseLicenseModal(false);

  return (
    <div>
      <div>
        <EraseLicenseModal
          show={showEraseLicenseModal}
          handleClose={handleCloseEraseLicenseModal}
        />
      </div>
      <TitleBar title={t("settings:moduleName")} showInfoIcon={false} />
      <div className="content">
        {/*  訂閱 */}
        <div>
          <h3>{t("license:subscriptionSectionTitle")}</h3>
          <div className={`shadow-view padding-16 border-radius-xlarge bg-color-primary-dark-elevated ${licenseManagement.tier === "PAID" ? "pro" : ""}`}>
            <div>
              {licenseManagement.tier == "PAID" ? (
                <>
                  <h4>{licenseManagement.recurrence === "monthly" ? t("license:monthly") : t("license:yearly")}</h4>
                  <p className="note note-large">{t("license:proPlanDesc")}</p>
                </>
              ) : (
                <>
                  <h4>{t("license:free")}</h4>
                  <p className="note note-large">{t("license:freePlanDesc")}</p>
                </>
              )}
            </div>
            {licenseManagement.tier !== "PAID" &&
              <div className="mt-xsmall grid">
                <FigmaButton
                  buttonType="tertiary"
                  title={t("license:activateLicense")}
                  onClick={() => {
                    setShowActivateModal(true);
                  }}
                  svg={<SvgKey color="var(--figma-color-text)" />}
                />
                <FigmaButton
                  title={t("license:upgrade")}
                  buttonType="special"
                  onClick={() => {
                    setShowCTSubscribe(true);
                  }}
                />
              </div>
            }
          </div>
        </div>
        {/* Click Saved */}
        <ProductivityDashboard
          savedClicks={editorPreference.savedClicks}
        />
        {/* 偏好語言 */}
        <PreferredLanguageView
          lang={i18n.language}
          onChange={handleLangChange}
        />
        {/* 關於本Plugin */}
        <div className="mt-large">
          <h3>{t("settings:about")}</h3>
          <div className="about-spaciiing">
            <div className="membership-block">
              <p className="color--secondary">{t("settings:version")}</p>
              <span>{info.version}</span>
            </div>
            <div className="membership-block">
              <p className="color--secondary">What's new in this version</p>
              <ul>
                {info.whatsNew.map((item) => <li>{item}</li>)}
              </ul>
            </div>
            <div className="grid">
              <div className="membership-block">
                <p className="color--secondary">Share Spaciiing on X(Twitter)</p>
                <a
                  href="https://x.com/intent/post?url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Fplugin%2F1129646367083296027%2Fspaciiing"
                  target="_blank"
                >
                  <span className="text-color-primary">

                    Share

                  </span>
                </a>
              </div>
              <div className="membership-block">
                <p className="color--secondary">
                  {t("settings:provideFeedback")}
                </p>
                <a
                  href="https://forms.gle/jFgzJfs1nw259Kgk8"
                  target="_blank"
                ><span className="text-color-primary">

                    {t("settings:feedbackForm")}

                  </span></a>
              </div>
            </div>
            <div className="membership-block">
              <p className="color--secondary">
                {t("settings:forBugReportOrSupport")}
              </p>
              <a
                href="mailto:contact@hsiehchengyi.com"
                target="_blank"
              >
                <span className="text-color-primary">
                  contact@hsiehchengyi.com
                </span>
              </a>
            </div>
            <div className="membership-block">
              <p className="color--secondary">
                {t("settings:developer")}
              </p>
              <a
                href="https://www.linkedin.com/in/cheng-yi-hsieh/"
                target="_blank"
              >
                <span className="text-color-primary">
                  Cheng-Yi Hsieh
                </span>
              </a>
            </div>
          </div>
        </div>
        {/* 危險區域 */}
        {licenseManagement.tier === "PAID" &&
          <>
            <h3 className="mt-large">{t("license:dangerZone")}</h3>
            <div className={`shadow-view padding-16 border-radius-xlarge bg-color-primary-dark-elevated`}>
              <FigmaButton
                title={t("license:eraseLicense")}
                buttonType="secondary--danger"
                onClick={() => {
                  handleOpenEraseLicenseModal();
                }}
                svg={<SvgEraser color="var(--figma-color-text-danger)" />}
              />
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default Setting;
