import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from '.';
import { strokeCapsPlain, strokeCapsWithDecoration } from '../module-frontend/arrowCreatorFrontEnd';

interface StrokeCapSelectorProps {
  titleKey: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StrokeCapSelector: React.FC<StrokeCapSelectorProps> = ({
  titleKey,
  value,
  onChange
}) => {
  const { t } = useTranslation(["module", "term"]);

  return (
    <div>
      <SectionTitle title={t(titleKey)} titleType="secondary" />
      <select name="type" className="custom-select" value={value} onChange={onChange}>
        {strokeCapsPlain.map((item) => (
          <option key={item.value} value={item.value}>{t(item.labelKey)}</option>
        ))}
        <hr />
        {strokeCapsWithDecoration.map((item) => (
          <option key={item.value} value={item.value}>{t(item.labelKey)}</option>
        ))}
      </select>
    </div>
  );
};

export default StrokeCapSelector;
