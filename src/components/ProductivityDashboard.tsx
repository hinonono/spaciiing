import React from 'react';
import { SvgGrid, SvgInfo } from '../assets/icons';
import { useTranslation } from 'react-i18next';

interface ProductivityDashboardProps {
  savedClicks: number
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ savedClicks }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-large">
      <h3>Productivity Dashboard</h3>
      <div className='productivity-dashboard shadow-view'>
        <div className='tooltip-wrap'>
          <div className="icon-tooltip icon-20 icon-hover">
            <SvgInfo color="var(--tooltip-icon)" />
            <span className="tooltiptext"><span>{savedClicks}</span><span className='text-color-secondary'> /10000</span></span>
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

export default ProductivityDashboard;
