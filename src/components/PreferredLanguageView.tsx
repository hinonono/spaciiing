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
    label: "繁體中文"
  },
  {
    value: "zhCN",
    label: "简体中文"
  }
]

export default PreferredLanguageView;
