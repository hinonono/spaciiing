import React from 'react';
import { useTranslation } from 'react-i18next';
import { LicenseResponse } from '../types/LicenseManagement';
import SectionTitle from './SectionTitle';

interface LicenseKeyInputProps {
  licenseKey: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  response: LicenseResponse | null;
  error: string | null;
}

const LicenseKeyInput: React.FC<LicenseKeyInputProps> = ({ licenseKey, onChange, response, error }) => {
  const { t } = useTranslation(["license", "term"]);

  return (
    <div className="mt-xxsmall">
      <SectionTitle title={t("module:licenseKey")} />
      <div className="width-100">
        <textarea
          className="textarea"
          rows={1}
          value={licenseKey}
          onChange={onChange}
          placeholder={t("license:enterYourLicenseKeyHere")}
        />
        {response && (
          <div>
            <pre className="note success">{t("license:activateSuccess")}</pre>
          </div>
        )}
        {error && (
          <div>
            <pre className="note error">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseKeyInput;
