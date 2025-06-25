import React from 'react';
import { SvgGrid, SvgInfo } from '../assets/icons';
import { useTranslation } from 'react-i18next';
import info from "../info.json";

interface ProductivityDashboardProps {
  savedClicks: number
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ savedClicks }) => {
  const { t } = useTranslation(["license", "module"]);
  const tier = getNextTier(savedClicks);

  return (
    <div className="mt-large">
      <h3>{t("module:productivityDashboard")}</h3>
      <div className='productivity-dashboard shadow-view'>
        <div className='tooltip-wrap'>
          <div className="icon-tooltip icon-20 icon-hover">
            <SvgInfo color="var(--tooltip-icon)" />
            <span className="tooltiptext">
              {tier.tier === "DIAMOND" ? t("module:maxedTier") : t("module:toNextTier").replace("$CLICK_LEFT$", `${tier.max - savedClicks}`)}
            </span>
          </div>
        </div>
        <div className="icon-48 tier-badge"><SvgGrid color="var(--figma-color-text)" /></div>
        <p className={`tier-name tier-name-${tier.tier} mt-xxsmall`}>{t(tier.translateKey)}</p>
        <span className="note note-large text-center">
          {t("license:youSaved")
            .replace("$SAVED_CLICKS$", `${savedClicks}`)
            .replace("$SAVED_MIN$", `${savedClicks / 20}`)
          }
        </span>
      </div>
    </div>
  );
};

function getNextTier(click: number): { tier: string; max: number; translateKey: string } {
  const tierList = info.clickTier;

  for (let i = 0; i < tierList.length; i++) {
    const tier = tierList[i];

    if (click < tier.max) {
      return tier;
    } else if (i === tierList.length - 1) {
      return {
        tier: tier.tier,
        max: Infinity,
        translateKey: tier.translateKey
      }
    }
  }

  // Fallback in case tierList is empty (optional safety)
  return { tier: "UNKNOWN", max: Infinity, translateKey: "unknown" };
}

export default ProductivityDashboard;
