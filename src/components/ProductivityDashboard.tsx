import React from 'react';
import { SvgGrid, SvgInfo } from '../assets/icons';
import { useTranslation } from 'react-i18next';
import info from "../info.json";

interface ProductivityDashboardProps {
  savedClicks: number
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ savedClicks }) => {
  const { t } = useTranslation();
  const tier = getNextTier(savedClicks);

  return (
    <div className="mt-large">
      <h3>Productivity Dashboard</h3>
      <div className='productivity-dashboard shadow-view'>
        <div className='tooltip-wrap'>
          <div className="icon-tooltip icon-20 icon-hover">
            <SvgInfo color="var(--tooltip-icon)" />
            <span className="tooltiptext"><span>{savedClicks}</span>{tier.tier !== "DIAMOND" && <span className='text-color-secondary'> /{tier.max}</span>}</span>
          </div>
        </div>
        <div className="icon-48"><SvgGrid color="var(--figma-color-text)" /></div>
        <span className="mt-xxsmall note note-large text-center">
          {t("license:youSaved")
            .replace("$SAVED_CLICKS$", `${savedClicks}`)
            .replace("$SAVED_MIN$", `${savedClicks / 20}`)
          }
        </span>
      </div>
    </div>
  );
};

function getNextTier(click: number): { tier: string; max: number } {
  const tierList = info.clickTier;

  for (let i = 0; i < tierList.length; i++) {
    const tier = tierList[i];

    if (click < tier.max) {
      return tier;
    } else if (i === tierList.length - 1) {
      return {
        tier: tier.tier,
        max: Infinity
      }
    }
  }

  // Fallback in case tierList is empty (optional safety)
  return { tier: "UNKNOWN", max: Infinity };
}

export default ProductivityDashboard;
