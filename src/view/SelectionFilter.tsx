import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import Modal from "../components/Modal";
import { NodeFilterable } from "../types/NodeFilterable";
import { MessageSelectionFilter } from "../types/Message";
import { useAppContext } from "../AppProvider";

const FilterableScopes: NodeFilterable[] = [
  "ALL_OPTIONS",
  "IMAGE",
  "TEXT",
  "FRAME",
  "GROUP",
  "AUTO_LAYOUT",
  "INSTANCE",
  "COMPONENT",
  "COMPONENT_SET",
  "RECTANGLE",
  "ELLIPSE",
  "LINE",
  "POLYGON",
  "STAR",
  "VECTOR",
];

const SelectionFilter: React.FC = () => {
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 主要功能
  const [selectedScopes, setSelectedScopes] = useState<NodeFilterable[]>([]);
  const handleScopeChange = (scope: NodeFilterable) => {
    if (scope === "ALL_OPTIONS") {
      // Toggle specific fill scopes
      const fillScopes: NodeFilterable[] = FilterableScopes;
      setSelectedScopes((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => !fillScopes.includes(s))
          : [...new Set([...prevScopes, ...fillScopes])]
      );
    } else {
      // Standard toggle for individual scopes
      setSelectedScopes((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => s !== scope)
          : [...prevScopes, scope]
      );
    }
  };
  const [findCriteria, setFindCriteria] = useState("");
  const handleFindCriteriaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFindCriteria(event.target.value);
  };

  // 傳送訊息
  const applySelectionFilter = () => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageSelectionFilter = {
      filterScopes: selectedScopes,
      findCriteria: findCriteria,
      module: "SelectionFilter",
      phase: "Actual",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  return (
    <div>
      <div>
        <Modal
          show={showExplanationModal}
          handleClose={handleCloseExplanationModal}
        >
          <div>
            <h3>Selection Filter</h3>
            <p>Filter your selection with various of available options.</p>
          </div>
        </Modal>
      </div>

      <TitleBar
        title="Selection Filter"
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle title={`Filter for (${selectedScopes.length})`} />
          <div className="custom-checkbox-group scope-group hide-scrollbar-vertical">
            {FilterableScopes.map((scope) => (
              <label key={scope} className="container">
                {scope}
                <input
                  type="checkbox"
                  value={scope}
                  checked={selectedScopes.includes(scope)}
                  onChange={() => handleScopeChange(scope)}
                />
                <span className="checkmark"></span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={"Find with name (Optional)"} />
          <div className="width-100">
            <textarea
              className="textarea"
              rows={1}
              value={findCriteria}
              onChange={handleFindCriteriaChange}
              placeholder="Find with name"
            />
          </div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={"Filter"}
            id={"selection-filter-apply"}
            onClick={applySelectionFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionFilter;
