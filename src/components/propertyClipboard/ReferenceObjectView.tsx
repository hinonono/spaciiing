import React from 'react';
import { FigmaButton } from '..';
import { useTranslation } from 'react-i18next';

interface ReferenceObjectViewProps {
  title: string;
  memorizeAction: () => void;
}

const ReferenceObjectView: React.FC<ReferenceObjectViewProps> = ({
  title,
  memorizeAction
}) => {
  const { t } = useTranslation(["module", "term"]);

  return (
    <div className="shadow-view padding-16 border-radius-xlarge bg-color-primary-dark-elevated flex flex-justify-space-between align-items-center">
      <span className="note text-color-primary">
        {title}
      </span>
      <FigmaButton
        buttonType="tertiary"
        title={t("module:memorize")}
        onClick={memorizeAction}
        buttonHeight="small"
        hasTopBottomMargin={false}
      />
    </div>
  );
};

export default ReferenceObjectView;
