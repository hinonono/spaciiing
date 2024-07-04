import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import Modal from "../components/Modal";
import { NodeFilterable } from "../types/NodeFilterable";
import { MessageSelectionFilter } from "../types/Message";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";

interface FilterScopeItem {
  nameKey: string;
  scope: NodeFilterable;
  indented?: boolean;
  indentLevel?: number;
}

const SelectionFilter: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const FilterableScopesNew: FilterScopeItem[] = [
    { nameKey: "term:allOptions", scope: "ALL_OPTIONS" },
    { nameKey: "term:image", scope: "IMAGE" },
    { nameKey: "term:text", scope: "TEXT" },
    { nameKey: "term:frame", scope: "FRAME" },
    { nameKey: "term:group", scope: "GROUP" },
    { nameKey: "term:autoLayout", scope: "AUTO_LAYOUT" },
    { nameKey: "term:instance", scope: "INSTANCE" },
    { nameKey: "term:component", scope: "COMPONENT" },
    { nameKey: "term:componentSet", scope: "COMPONENT_SET" },
    { nameKey: "term:allShape", scope: "ALL_SHAPE" },
    {
      nameKey: "term:rectangle",
      scope: "RECTANGLE",
      indented: true,
      indentLevel: 1,
    },
    {
      nameKey: "term:ellipse",
      scope: "ELLIPSE",
      indented: true,
      indentLevel: 1,
    },
    { nameKey: "term:line", scope: "LINE", indented: true, indentLevel: 1 },
    {
      nameKey: "term:polygon",
      scope: "POLYGON",
      indented: true,
      indentLevel: 1,
    },
    { nameKey: "term:star", scope: "STAR", indented: true, indentLevel: 1 },
    { nameKey: "term:vector", scope: "VECTOR", indented: true, indentLevel: 1 },
  ];

  // 主要功能
  const [selectedScopes, setSelectedScopes] = useState<NodeFilterable[]>([]);
  const handleScopeChange = (scope: NodeFilterable) => {
    if (scope === "ALL_OPTIONS") {
      // Toggle specific fill scopes
      const scopes = FilterableScopesNew.map((item) => item.scope);
      const fillScopes: NodeFilterable[] = scopes;
      setSelectedScopes((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => !fillScopes.includes(s))
          : [...new Set([...prevScopes, ...fillScopes])]
      );
    } else if (scope === "ALL_SHAPE") {
      // Toggle specific fill scopes
      const fillScopes: NodeFilterable[] = [
        "RECTANGLE",
        "ELLIPSE",
        "LINE",
        "POLYGON",
        "STAR",
        "VECTOR",
        "ALL_SHAPE",
      ];
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
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
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
            <h3>{t("module:moduleSelectionFilter")}</h3>
            <p>{t("module:moduleSelectionFilterDesc")}</p>
          </div>
        </Modal>
      </div>
      <TitleBar
        title={t("module:moduleSelectionFilter")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle
            title={`${t("module:filterFor")} (${selectedScopes.length})`}
          />
          <div className="custom-checkbox-group scope-group hide-scrollbar-vertical">
            {FilterableScopesNew.map((item) => (
              <label
                key={t(item.nameKey)}
                className={`container ${
                  item.indented ? `indent-level-${item.indentLevel}` : ""
                }`}
              >
                {t(item.nameKey)}
                <input
                  type="checkbox"
                  value={item.scope}
                  checked={selectedScopes.includes(item.scope)}
                  onChange={() => handleScopeChange(item.scope)}
                />
                <span className="checkmark"></span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:findWithNameOptional")} />
          <div className="width-100">
            <textarea
              className="textarea"
              rows={1}
              value={findCriteria}
              onChange={handleFindCriteriaChange}
              placeholder={t("module:findWithName")}
            />
          </div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={t("module:filter")}
            id={"selection-filter-apply"}
            onClick={applySelectionFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionFilter;
