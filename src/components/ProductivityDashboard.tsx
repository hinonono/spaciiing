import React, { useState } from 'react';
import { SvgBadgeBronze, SvgBadgeDiamond, SvgBadgeGold, SvgBadgePlatinum, SvgBadgeSliver, SvgGrid, SvgInfo } from '../assets/icons';
import { useTranslation } from 'react-i18next';
import info from "../pluginConfig.json";
import { SavedClicksTier, SavedClicksTierObj } from '../types/Tier';
import ProgressBar from './ProgressBar';

interface ProductivityDashboardProps {
  savedClicks: number
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ savedClicks }) => {
  const { t } = useTranslation(["license", "module"]);
  const tier = getNextTier(savedClicks);

  const [showPercentage, setShowPercentage] = useState(false);
  const content = showPercentage
    ? `${savedClicks - tier.requiredExp} / ${tier.requiredExp}`
    : `${Math.round(((savedClicks - tier.requiredExp) / tier.requiredExp) * 100)}%`;

  function toggleShowPercentage() {
    setShowPercentage(!showPercentage);
  }

  return (
    <div className="mt-large">
      <h3>{t("module:productivityDashboard")}</h3>
      <div className='productivity-dashboard shadow-view'>
        <div className="icon-48 tier-badge">{getBadge(tier.tier)}</div>
        <p className={`tier-name tier-name-${tier.tier} mt-xxsmall`}>{t(tier.translateKey)}</p>
        <span className="note note-large">
          {t("license:youSaved")
            .replace("$SAVED_CLICKS$", `${savedClicks}`)
            .replace("$SAVED_MIN$", `${Math.round(savedClicks / 20)}`)
          }
        </span>
        {tier.tier !== "DIAMOND" &&
          <div className='width-100 mt-small'>
            <div className='width-100 flex flex-justify-space-between'>
              <span className='note'>{t("module:progress")}</span>
              <span className='note' style={{ cursor: 'pointer' }} onClick={toggleShowPercentage}>{content}</span>
            </div>
            <ProgressBar
              additionalClass='mt-xxxsmall'
              progress={savedClicks - tier.requiredExp}
              max={tier.requiredExp}
            />
          </div>
        }
      </div>
    </div>
  );
};

function getNextTier(click: number): SavedClicksTierObj {
  const tierList = info.clickTier as SavedClicksTierObj[];

  for (let i = 0; i < tierList.length; i++) {
    const tier = tierList[i];

    if (click < tier.max) {
      return tier;
    } else if (i === tierList.length - 1) {
      return {
        tier: tier.tier,
        max: Infinity,
        requiredExp: Infinity,
        translateKey: tier.translateKey
      }
    }
  }

  // Fallback in case tierList is empty (optional safety)
  return { tier: "UNKNOWN", max: Infinity, requiredExp: Infinity, translateKey: "unknown" };
}

function getBadge(tier: SavedClicksTier) {
  switch (tier) {
    case "BRONZE":
      return <SvgBadgeBronze />
    case "SLIVER":
      return <SvgBadgeSliver />
    case "GOLD":
      return <SvgBadgeGold />
    case "PLATINUM":
      return <SvgBadgePlatinum />
    case "DIAMOND":
      return <SvgBadgeDiamond />
    default:
      return null;
  }
}

export default ProductivityDashboard;
