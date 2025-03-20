import React, { useEffect, useState } from "react";
import { TitleBar, SectionTitle, FigmaButton, ColorThumbnailView } from "../components";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import { getOptionsForSelectedBrandAndForm } from "../components/PresetLibraryOptions";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import {
  InstantiaterSupportedBrand,
  InstantiaterCategory,
  InstantiateForm,
  InstantiaterTarget,
  InstantiaterType,
  MessageInstantiater,
} from "../types/Messages/MessageInstantiater";
import SegmentedControl from "../components/SegmentedControl";
import * as info from "../info.json";

const Instantiater: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);
  const { licenseManagement, setShowCTSubscribe, variableCollectionList, setFreeUserDelayModalConfig } =
    useAppContext();
  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [selectedBrand, setSelectedBrand] =
    useState<InstantiaterSupportedBrand>("antDesign");
  const [selectedCat, setSelectedCat] = useState<InstantiaterCategory>("color");
  const [form, setForm] = useState<InstantiateForm>("style");

  const [categoryOptionsCount, setCategoryOptionsCount] = useState<{
    [key in InstantiaterCategory]: number;
  }>({
    color: 0,
    effect: 0,
    typography: 0,
    other: 0,
  });
  const calculateOptionsCount = (brand: InstantiaterSupportedBrand) => {
    const counts: { [key in InstantiaterCategory]: number } = {
      color: getOptionsForSelectedBrandAndForm(brand, "color", form).length,
      effect: getOptionsForSelectedBrandAndForm(brand, "effect", form).length,
      typography: getOptionsForSelectedBrandAndForm(brand, "typography", form)
        .length,
      other: getOptionsForSelectedBrandAndForm(brand, "other", form).length,
    };
    setCategoryOptionsCount(counts);
    console.log(counts);
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value as InstantiaterSupportedBrand;
    setSelectedBrand(brand);
    setSelectedCat("color");
    setSelectedTargets([]); // Reset the selected option when the brand changes
    calculateOptionsCount(brand); // Calculate options count for the new brand
  };
  const handleCatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = event.target.value as InstantiaterCategory;
    setSelectedCat(cat);
    setSelectedTargets([]); // Reset the selected option when the brand changes
  };

  const options = getOptionsForSelectedBrandAndForm(
    selectedBrand,
    selectedCat,
    form
  );

  const [selectedTargets, setSelectedTargets] = useState<InstantiaterTarget[]>(
    []
  );
  const handleTargetChange = (target: InstantiaterTarget) => {
    if (target === "all") {
      // Toggle specific fill scopes
      const scopes = options.map((item) => item.value);
      // const fillScopes: InstantiaterTarget[] = scopes;

      setSelectedTargets((prevTargets) =>
        prevTargets.includes(target)
          ? prevTargets.filter((s) => !scopes.includes(s))
          : [...new Set([...prevTargets, ...scopes])]
      );
    } else {
      // Standard toggle for individual scopes
      setSelectedTargets((prevTargets) =>
        prevTargets.includes(target)
          ? prevTargets.filter((s) => s !== target)
          : [...prevTargets, target]
      );
    }
  };

  useEffect(() => {
    setSelectedTargets([]); // Reset target when options change
  }, [selectedBrand, selectedCat]);

  useEffect(() => {
    calculateOptionsCount(selectedBrand); // Initial calculation on component mount
  }, [selectedBrand, form]);

  const applyInstantiater = (type: InstantiaterType, isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: info.freeUserWaitingTime,
          onProceed: () => applyInstantiater(type, true),
        });
        return;
      }
    }

    if (selectedTargets == null || selectedTargets.length === 0) {
      console.warn("No targets selected. Aborting instantiation.");
      return;
    }

    const message: MessageInstantiater = {
      module: "Instantiater",
      targets: selectedTargets,
      direction: "Inner",
      type: type,
      form: form,
      variableCollectionId: destination,
      newCollectionName: defaultNewCollectionName,
      phase: "Actual",
    };

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  const [destination, setDestination] = useState("new");
  useEffect(() => {
    if (variableCollectionList.length > 0 && destination === "new") {
      setDestination(variableCollectionList[0].id);
    }
  }, [variableCollectionList]);

  const [defaultNewCollectionName, setDefaultNewCollectionName] =
    useState("New Collection");

  const handleDefaultNewCollectionNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDefaultNewCollectionName(event.target.value);
  };

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>{t("module:modulePresetLibrary")}</h3>
          <p>{t("module:modulePresetLibraryDesc")}</p>
        </div>
      </Modal>
      <TitleBar
        title={t("module:modulePresetLibrary")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        <div>
          <SectionTitle title={t("module:generateAs")} />
          <SegmentedControl
            inputName="form"
            value={form}
            onChange={(newForm) => setForm(newForm as InstantiateForm)}
          >
            <SegmentedControl.Option value="style" label="term:style" />
            <SegmentedControl.Option value="variable" label="term:variable" />
          </SegmentedControl>
        </div>
        {/* Destination */}
        {form === "variable" && (
          <div className="mt-xxsmall">
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
        )}
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:collection")} />
          {/* 選擇品牌 */}
          <select
            id="brand_select"
            className="custom-select"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="antDesign">Ant Design</option>
            {/* <option value="bootstrap">Bootstrap</option> */}
            <option value="ios">iOS</option>
            {/* <option value="carbon">IBM Carbon</option> */}
            <option value="materialDesign">Material Design</option>
            {/* <option value="polaris">Shopify Polaris</option> */}
            {/* <option value="tailwind">Tailwind CSS</option> */}
          </select>
          <div className="mt-xxsmall"></div>
          {/* 選擇類型 */}
          <select
            className="custom-select"
            value={selectedCat}
            onChange={handleCatChange}
          >
            {categoryOptionsCount.color > 1 && (
              <option value="color">{t("term:color")}</option>
            )}
            {categoryOptionsCount.effect > 1 && (
              <option value="effect">{t("term:effect")}</option>
            )}
            {categoryOptionsCount.typography > 1 && (
              <option value="typography">{t("term:typography")}</option>
            )}
            {categoryOptionsCount.other > 1 && (
              <option value="other">{t("term:others")}</option>
            )}
          </select>
          <div className="mt-xxsmall"></div>
          {/* 選項 */}
          <div className="cy-checkbox-group border-1-cy-border-light scope-group scope-group-large hide-scrollbar-vertical">
            {options.map((option) => (
              <label key={option.value} className={`container`}>
                <div className="flex flex-row align-items-center flex-justify-space-between">
                  <div className="flex flex-row align-items-center">
                    {option.label !== "ALL" && selectedCat === "color" && option.thumbnailColor && (
                      <ColorThumbnailView color={option.thumbnailColor} opacity={1} size={20} type={form === "style" ? "rounded" : "square"} extraClassName="mr-xxxsmall" />
                    )}
                    {option.label === "ALL"
                      ? t("term:allOptions")
                      : option.label}
                  </div>
                  {option.count && (
                    <div className="text-color-secondary">{option.count}</div>
                  )}
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedTargets.includes(option.value)}
                    onChange={() => handleTargetChange(option.value)}
                  />
                  <span className="checkmark checkmark-large"></span>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-xsmall"></div>
        <div>
          <FigmaButton
            title={t("module:generate") + ` (${selectedTargets.length})`}
            id={"instantiater-apply"}
            onClick={() => applyInstantiater("actual")}
          />
        </div>
      </div>
    </div>
  );
};

export default Instantiater;
