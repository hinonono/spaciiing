import React, { useState } from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import SectionTitle from "../SectionTitle";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { ShortcutAction, MessageShortcutFindAndReplace } from "../../types/Messages/MessageShortcut";
import * as info from "../../info.json";

interface FindAndReplaceModalProps {
  show: boolean;
  handleClose: () => void;
}

const FindAndReplaceModal: React.FC<FindAndReplaceModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module"]);
  const { licenseManagement, setShowCTSubscribe, setFreeUserDelayModalConfig } = useAppContext();

  const [findCriteria, setFindCriteria] = useState("");
  const [replaceCriteria, setReplaceCriteria] = useState("");
  const [keepOriginalLayerName, setKeepOriginalLayerName] = useState(false);

  const handleFindCriteriaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFindCriteria(event.target.value);
  };
  const handleReplaceCriteriaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReplaceCriteria(event.target.value);
  };

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setKeepOriginalLayerName(event.target.checked);
  };

  const applyFindAndReplace = (action: ShortcutAction, isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: info.freeUserWaitingTime,
          onProceed: () => applyFindAndReplace(action, true),
        });
        return;
      }
    }

    if (action === "findAndReplace") {
      const message: MessageShortcutFindAndReplace = {
        module: "Shortcut",
        action: action,
        direction: "Inner",
        phase: "Actual",
        findCriteria: findCriteria,
        replaceCriteria: replaceCriteria,
        keepOriginalLayerName: keepOriginalLayerName,
      };
      parent.postMessage(
        {
          pluginMessage: message,
        },
        "*"
      );
    }
  };

  return (
    <Modal
      show={show}
      handleClose={handleClose}
    >
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:findInSelection")} />
        <div className="width-100">
          <textarea
            className="textarea"
            rows={1}
            value={findCriteria}
            onChange={handleFindCriteriaChange}
            placeholder={t("module:find")}
          />
        </div>
      </div>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:replace")} />
        <div className="width-100">
          <textarea
            className="textarea"
            rows={1}
            value={replaceCriteria}
            onChange={handleReplaceCriteriaChange}
            placeholder={t("module:replace")}
          />
        </div>
      </div>
      <span className="note">
        {t("module:findAndReplaceCriteriaAreCaseSensitive")}
      </span>
      <div className="mt-xsmall">
        <div className="cy-checkbox-group">
          <label className="container">
            {t("module:keepOriginalNameOfTextLayers")}
            <input
              type="checkbox"
              checked={keepOriginalLayerName}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <FigmaButton
          title={t("module:apply")}
          id={"shortcut-apply-find-and-replace-in-selection"}
          onClick={() => {
            applyFindAndReplace("findAndReplace");
          }}
        />
      </div>
    </Modal>
  );
};

export default FindAndReplaceModal;
