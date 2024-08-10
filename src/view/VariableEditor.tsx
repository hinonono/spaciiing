import React, { useEffect, useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import {
  MessageGetAvailableCollectionMode,
  MessageVariableEditorExecuteCode,
} from "../types/Message";
import { useAppContext } from "../AppProvider";
import MonacoCodeEditor from "../components/MonacoCodeEditor";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import { exampleCodeBase } from "../components/ExampleVariableCreationCode";

interface KeyAndScope {
  nameKey: string;
  scope: VariableScope;
  indented?: boolean;
  indentLevel?: number;
}

interface NameAndResolvedDataType {
  nameKey: string;
  members: KeyAndScope[];
}

const VariableScopesNew: {
  [key in VariableResolvedDataType]: NameAndResolvedDataType;
} = {
  BOOLEAN: {
    nameKey: "term:boolean",
    members: [],
  },
  COLOR: {
    nameKey: "term:color",
    members: [
      { nameKey: "term:allScopes", scope: "ALL_SCOPES" },
      { nameKey: "term:allFills", scope: "ALL_FILLS" },
      {
        nameKey: "term:frameFill",
        scope: "FRAME_FILL",
        indented: true,
        indentLevel: 1,
      },
      {
        nameKey: "term:shapeFill",
        scope: "SHAPE_FILL",
        indented: true,
        indentLevel: 1,
      },
      {
        nameKey: "term:textFill",
        scope: "TEXT_FILL",
        indented: true,
        indentLevel: 1,
      },
      { nameKey: "term:strokeColor", scope: "STROKE_COLOR" },
      { nameKey: "term:effectColor", scope: "EFFECT_COLOR" },
    ],
  },
  FLOAT: {
    nameKey: "term:float",
    members: [
      { nameKey: "term:allScopes", scope: "ALL_SCOPES" },
      { nameKey: "term:textContent", scope: "TEXT_CONTENT" },
      { nameKey: "term:cornerRadius", scope: "CORNER_RADIUS" },
      { nameKey: "term:widthHeight", scope: "WIDTH_HEIGHT" },
      { nameKey: "term:gap", scope: "GAP" },
      { nameKey: "term:opacity", scope: "OPACITY" },
      { nameKey: "term:strokeFloat", scope: "STROKE_FLOAT" },
      { nameKey: "term:effectFloat", scope: "EFFECT_FLOAT" },
      { nameKey: "term:fontWeight", scope: "FONT_WEIGHT" },
      { nameKey: "term:fontSize", scope: "FONT_SIZE" },
      { nameKey: "term:lineHeight", scope: "LINE_HEIGHT" },
      { nameKey: "term:letterSpacing", scope: "LETTER_SPACING" },
      { nameKey: "term:paragraphSpacing", scope: "PARAGRAPH_SPACING" },
      { nameKey: "term:paragraphIndent", scope: "PARAGRAPH_INDENT" },
    ],
  },
  STRING: {
    nameKey: "term:string",
    members: [
      { nameKey: "term:allScopes", scope: "ALL_SCOPES" },
      { nameKey: "term:textContent", scope: "TEXT_CONTENT" },
      { nameKey: "term:fontFamily", scope: "FONT_FAMILY" },
      { nameKey: "term:fontStyle", scope: "FONT_STYLE" },
    ],
  },
};

const VariableEditor: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [defaultNewCollectionName, setDefaultNewCollectionName] =
    useState("New Collection");

  const {
    variableCollectionList,
    variableCollectionModes,
    licenseManagement,
    setShowCTSubscribe,
    customCodeExecutionResults,
    setCustomCodeExecutionResults,
  } = useAppContext();
  const [code, setCode] = useState<string>("");

  const [destination, setDestination] = useState("new");
  useEffect(() => {
    if (variableCollectionList.length > 0 && destination === "new") {
      setDestination(variableCollectionList[0].id);
    }
  }, [variableCollectionList]);

  const [dataType, setDataType] = useState<VariableResolvedDataType>("COLOR");

  const [variableMode, setVariableMode] = useState("");
  useEffect(() => {
    if (variableCollectionModes.length > 0 && variableMode === "") {
      setVariableMode(variableCollectionModes[0].modeId);
    }
  }, [variableCollectionModes]);

  const [variableScope, setVariableScope] = useState<VariableScope[]>(
    VariableScopesNew[dataType].members.map((item) => item.scope)
  );

  useEffect(() => {
    setVariableScope(
      VariableScopesNew[dataType].members.map((item) => item.scope)
    );
    setCode("");
  }, [dataType]);

  useEffect(() => {
    // 取得對應destination中的mode
    getAvailableMode();
  }, [destination]);

  const getAvailableMode = () => {
    if (destination == "new" || destination == "") {
      return;
    }
    const message: MessageGetAvailableCollectionMode = {
      intent: "getAvailableMode",
      id: destination,
      module: "VariableEditor",
      direction: "Inner",
      phase: "Actual",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const handleDefaultNewCollectionNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDefaultNewCollectionName(event.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as VariableResolvedDataType;
    setDataType(newType);
    setVariableScope([]); // Reset variable scope when changing type
  };

  const handleScopeChange = (scope: VariableScope) => {
    if (scope === "ALL_SCOPES") {
      // Toggle all scopes
      const allScopes = VariableScopesNew[dataType].members.map(
        (item) => item.scope
      );
      setVariableScope((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => !allScopes.includes(s))
          : allScopes
      );
    } else if (scope === "ALL_FILLS") {
      // Toggle specific fill scopes
      const fillScopes: VariableScope[] = [
        "ALL_FILLS",
        "FRAME_FILL",
        "SHAPE_FILL",
        "TEXT_FILL",
      ];
      setVariableScope((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => !fillScopes.includes(s))
          : [...new Set([...prevScopes, ...fillScopes])]
      );
    } else {
      // Standard toggle for individual scopes
      setVariableScope((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => s !== scope)
          : [...prevScopes, scope]
      );
    }
  };

  const executeCode = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    // 清空先前的執行結果
    setCustomCodeExecutionResults([]);

    const message: MessageVariableEditorExecuteCode = {
      dataType: dataType,
      destination: destination,
      code: code,
      module: "VariableEditor",
      direction: "Inner",
      scope: variableScope,
      mode: variableMode,
      intent: "executeCode",
      phase: "Actual",
      newCollectionName: defaultNewCollectionName,
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const exampleCode = {
    COLOR: exampleCodeBase["COLOR"],
    FLOAT: exampleCodeBase["FLOAT"],
    STRING: exampleCodeBase["STRING"],
    BOOLEAN: exampleCodeBase["BOOLEAN"],
  };

  const generateExampleCodeSnippet = () => {
    setCode(exampleCode[dataType]);
  };

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>{t("module:moduleVariableGenerator")}</h3>
          <p>{t("module:moduleVariableGeneratorDesc")}</p>
          <h4>Destination</h4>
          <p>
            {t("module:destinationDesc1")}
            <br />
            <br />
            {t("module:destinationDesc2")}
          </p>
          <h4>{t("module:variableMode")}</h4>
          <p>{t("module:variableModeDesc")}</p>
          <h4>{t("module:valueType")}</h4>
          <p>{t("module:valueTypeDesc")}</p>
          <h4>{t("module:variableScope")}</h4>
          <p>{t("module:variableScopeDesc")}</p>
          <h4>{t("module:codeEditor")}</h4>
          <p>{t("module:codeEditorDesc1")}</p>
        </div>
      </Modal>
      <TitleBar
        title={t("module:moduleVariableGenerator")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* Destination */}
        <div>
          <SectionTitle title={t("module:destination")} />
          <select
            name="destination"
            className="custom-select"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="new">{t("module:createANewCollection")}</option>
            {variableCollectionList.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>
          {destination == "new" && (
            <div className="width-100 mt-xxsmall">
              <textarea
                className="textarea"
                rows={1}
                value={defaultNewCollectionName}
                onChange={handleDefaultNewCollectionNameChange}
                placeholder="New Collection"
              />
            </div>
          )}
          <div className="mt-xxsmall">
            <span className="note">{t("module:destinationDesc2")}</span>
          </div>
        </div>
        {/* Mode */}
        <div className="mt-xsmall">
          <SectionTitle title={t("module:variableMode")} />
          <select
            name="mode"
            className="custom-select"
            value={variableMode}
            onChange={(e) => setVariableMode(e.target.value)}
          >
            <option value="new">{t("module:createANewMode")}</option>
            {destination != "new" &&
              variableCollectionModes.map((item) => (
                <option value={item.modeId}>
                  {item.name}
                  {variableCollectionModes.length == 1
                    ? ` (${t("module:default")})`
                    : ""}
                </option>
              ))}
          </select>
        </div>
        {/* Type */}
        <div className="mt-xsmall">
          <SectionTitle title={t("module:valueType")} />
          <select
            name="type"
            className="custom-select"
            value={dataType}
            onChange={handleTypeChange}
          >
            {Object.keys(VariableScopesNew).map((type) => (
              <option key={type} value={type}>
                {t(VariableScopesNew[type as VariableResolvedDataType].nameKey)}
              </option>
            ))}
          </select>
        </div>
        {dataType !== "BOOLEAN" && (
          <div className="mt-xsmall">
            <SectionTitle
              title={
                t("module:variableScope") + "(" + variableScope.length + ")"
              }
            />
            <div className="custom-checkbox-group scope-group hide-scrollbar-vertical">
              {VariableScopesNew[dataType].members.map((item) => (
                <label
                  key={item.scope}
                  className={`container ${
                    item.indented ? `indent-level-${item.indentLevel}` : ""
                  }`}
                >
                  {t(item.nameKey)}
                  <input
                    type="checkbox"
                    value={item.scope}
                    checked={variableScope.includes(item.scope)}
                    onChange={() => handleScopeChange(item.scope)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>
        )}
        {/* Code */}
        <div className="mt-xsmall">
          <SectionTitle title={t("module:codeEditor")} />
          <div className="width-100">
            <div>
              <span className="note">
                {t("module:codeEditorDesc1")}
                <br />
                <br />
                {t("module:codeEditorDesc2")}
              </span>
            </div>
            <div className="mt-xxsmall">
              <MonacoCodeEditor code={code} setCode={setCode} />
            </div>
            {customCodeExecutionResults.length > 0 && (
              <div className="mt-xxsmall custom-checkbox-group scope-group hide-scrollbar-vertical">
                <ul>
                  {customCodeExecutionResults.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* Button */}
        <div className="mt-xsmall">
          <div className="grid">
            <FigmaButton
              buttonType="secondary"
              title={t("module:codeExampleFor") + dataType}
              id={"variable-editor-example-code-snippet"}
              onClick={generateExampleCodeSnippet}
              disabled={code.trim() !== ""}
            />
            <FigmaButton
              title={t("module:execute")}
              id={"variable-editor-execute"}
              onClick={executeCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableEditor;
