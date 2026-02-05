import React from 'react';
import Modal from '../Modal';
import { useTranslation } from 'react-i18next';
import FigmaButton from '../FigmaButton';
import * as licenseManagementFrontEnd from "../../module-frontend/licenseManagementFrontEnd";
import { useAppContext } from '../../AppProvider';

interface EraseLicenseModalProps {
  show: boolean;
  handleClose: () => void;
}

const EraseLicenseModal: React.FC<EraseLicenseModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["license"]);
  const {
    setLicenseManagement,
  } = useAppContext();

  return (
    <Modal show={show} handleClose={handleClose}>
      <h3>{t("license:eraseLicense")}</h3>
      <p style={{ whiteSpace: "pre-line" }} className="mb-small font-size-large">{t("license:eraseLicenseDesc")}</p>
      <div className="mt-xxsmall">
        <FigmaButton
          title={t("license:proceed")}
          buttonType={"danger"}
          onClick={async () => {
            try {
              await licenseManagementFrontEnd.eraseLicense(setLicenseManagement);
              handleClose();
            } catch (err) {
              console.error("eraseLicense failed", err);
            }
          }}
          hasTopBottomMargin={false}
        />
      </div>
    </Modal>
  );
};

export default EraseLicenseModal;
