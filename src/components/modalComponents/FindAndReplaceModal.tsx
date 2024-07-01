import React, { useState } from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import SectionTitle from "../SectionTitle";
import {
  MessageShortcutFindAndReplace,
  ShortcutAction,
} from "../../types/Message";
import { useAppContext } from "../../AppProvider";

interface FindAndReplaceModalProps {
  showFindAndReplaceModal: boolean;
  handleCloseFindAndReplaceModal: () => void;
}

const FindAndReplaceModal: React.FC<FindAndReplaceModalProps> = ({
  showFindAndReplaceModal,
  handleCloseFindAndReplaceModal,
}) => {
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

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

  const applyFindAndReplace = (action: ShortcutAction) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";
    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    if (action == "findAndReplace") {
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
      show={showFindAndReplaceModal}
      handleClose={handleCloseFindAndReplaceModal}
    >
      <div className="mt-xxsmall">
        <SectionTitle title={"Find in selection"} />
        <div className="width-100 mt-xxsmall">
          <textarea
            className="textarea"
            rows={1}
            value={findCriteria}
            onChange={handleFindCriteriaChange}
            placeholder="Find"
          />
        </div>
      </div>
      <div className="mt-xxsmall">
        <SectionTitle title={"Replace"} />
        <div className="width-100 mt-xxsmall">
          <textarea
            className="textarea"
            rows={1}
            value={replaceCriteria}
            onChange={handleReplaceCriteriaChange}
            placeholder="Replace"
          />
        </div>
      </div>
      <span className="note">
        Find and replace criteria are case sensitive.
      </span>
      <div className="mt-xsmall">
        <div className="custom-checkbox-group">
          <label className="container">
            Keep original name of text layer(s)
            <input
              type="checkbox"
              checked={keepOriginalLayerName}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <FigmaButton
          title={"Apply"}
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
