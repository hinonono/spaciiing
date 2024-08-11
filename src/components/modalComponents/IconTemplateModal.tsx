import React, { useState } from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import SectionTitle from "../SectionTitle";
import {
  MessageShortcutGenerateIconTemplate,
  ShortcutAction,
} from "../../types/Message";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";

interface IconTemplateModalProps {
  showIconModal: boolean;
  handleCloseIconModal: () => void;
}

const IconTemplateModal: React.FC<IconTemplateModalProps> = ({
  showIconModal,
  handleCloseIconModal,
}) => {
  const { t } = useTranslation(["module"]);
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  const [size, setSize] = useState("24");
  const [quantity, setQuantity] = useState("");

  const handleCustomValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuantity(event.target.value);
  };

  const applyGenerateIconTemplate = (action: ShortcutAction) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    if (action != "generateIconTemplate") {
      return;
    }

    const message: MessageShortcutGenerateIconTemplate = {
      module: "Shortcut",
      action: action,
      direction: "Inner",
      phase: "Actual",
      system: Number(size),
      quantity: Number(quantity),
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  return (
    <Modal show={showIconModal} handleClose={handleCloseIconModal}>
      <div>
        <SectionTitle title={t("module:size")} />
        <select
          name="size"
          className="custom-select"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="24">24px</option>
          <option value="48">48px</option>
        </select>
      </div>
      <div className="mt-xxsmall">
        <SectionTitle title={"Quantity"} />
        <div className="width-100 mt-xxsmall">
          <textarea
            className="textarea"
            rows={1}
            value={quantity}
            onChange={handleCustomValueChange}
            placeholder={t("module:howManyIconsToBeGenerated")}
          />
        </div>
      </div>
      <div className="mt-xxsmall">
        <FigmaButton
          title={t("module:apply")}
          id={"shortcut-apply-generate-icon-template"}
          onClick={() => {
            applyGenerateIconTemplate("generateIconTemplate");
          }}
        />
      </div>
    </Modal>
  );
};

export default IconTemplateModal;
