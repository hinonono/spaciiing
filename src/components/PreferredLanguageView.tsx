import React from 'react';
import { useTranslation } from 'react-i18next';

interface PreferredLanguageViewProps {
  lang: string;
  onChange: (event: { target: { value: string; }; }) => void
}

const PreferredLanguageView: React.FC<PreferredLanguageViewProps> = ({
  lang,
  onChange
}) => {
  const { t } = useTranslation(["settings"]);

  return (
    <div className="mt-large">
      <h3>{t("settings:preferredLanguage")}</h3>
      <select
        className="custom-select"
        value={lang}
        onChange={onChange}
      >
        {langOptions.map(item => (
          <option value={item.value}>{item.label}</option>
        ))}
      </select>
      {/* <span className='mt-xxsmall note'>{t("settings:preferredLanguageDesc")}</span> */}
    </div>
  );
};

const langOptions = [
  {
    value: "enUS",
    label: "English"
  },
  {
    value: "jaJP",
    label: "日本語"
  },
  {
    value: "zhTW",
    label: "中文（繁體）"
  },
  {
    value: "zhCN",
    label: "中文（简体）"
  }
]

export default PreferredLanguageView;
