import React, { useEffect, useState } from "react";
import { TitleBar, SectionTitle, FigmaButton } from "../components";
import {
  InstantiateForm,
  InstantiaterCategory,
  InstantiaterSupportedBrand,
  InstantiaterTarget,
  InstantiaterType,
  MessageInstantiater,
} from "../types/Message";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import { getOptionsForSelectedBrandAndForm } from "../components/PresetLibraryOptions";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";

const Instantiater: React.FC = () => {
  const { t } = useTranslation(["module", "terms"]);
  const { licenseManagement, setShowCTSubscribe } = useAppContext();
  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [selectedBrand, setSelectedBrand] =
    useState<InstantiaterSupportedBrand>("ios");
  const [selectedCat, setSelectedCat] = useState<InstantiaterCategory>("color");
  // const [target, setTarget] = useState<InstantiaterTarget>(
  //   "iosSystemColorsLight"
  // );
  const [form, setForm] = useState<InstantiateForm>("style");

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value as InstantiaterSupportedBrand;
    setSelectedBrand(brand);
    // setTarget("");
    setSelectedTargets([]); // Reset the selected option when the brand changes
  };
  const handleCatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = event.target.value as InstantiaterCategory;
    setSelectedCat(cat);
    // setTarget("");
    setSelectedTargets([]); // Reset the selected option when the brand changes
  };

  // const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setTarget(event.target.value as InstantiaterTarget);
  // };

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
    // setTarget("");
    setSelectedTargets([]); // Reset target when options change
  }, [selectedBrand, selectedCat, form]);

  const applyInstantiater = (type: InstantiaterType) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    if (selectedTargets == null) {
      return;
    }
    const message: MessageInstantiater = {
      module: "Instantiater",
      targets: selectedTargets,
      direction: "Inner",
      type: type,
      form: form,
      phase: "Actual",
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
          <div className="custom-segmented-control">
            <input
              type="radio"
              name="instantiater-form"
              id="instantiater-form-style"
              value="style"
              checked={form === "style"}
              onChange={() => setForm("style")}
            />
            <label htmlFor="instantiater-form-style">{t("module:style")}</label>
            <input
              type="radio"
              name="instantiater-form"
              id="instantiater-form-variable"
              value="variable"
              checked={form === "variable"}
              onChange={() => setForm("variable")}
            />
            <label htmlFor="instantiater-form-variable">
              {t("module:variable")}
            </label>
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:collection")} />
          {/* 選擇品牌 */}
          <select
            id="brand_select"
            className="custom-select"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="ios">iOS</option>
            <option value="materialDesign">Material Design</option>
            <option value="antDesign">Ant Design</option>
            <option value="tailwind">Tailwind CSS</option>
          </select>
          <div className="mt-xxsmall"></div>
          {/* 選擇類型 */}
          <select
            className="custom-select"
            value={selectedCat}
            onChange={handleCatChange}
          >
            <option value="color">Color</option>
            <option value="effect">Effect</option>
            <option value="typography">Typography</option>
          </select>
          <div className="mt-xxsmall"></div>
          {/* 選項 */}
          <div className="custom-checkbox-group scope-group hide-scrollbar-vertical">
            {options.map((option) => (
              <label key={option.value} className={`container`}>
                {option.label === "ALL" ? t("term:allOptions") : option.label}
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedTargets.includes(option.value)}
                  onChange={() => handleTargetChange(option.value)}
                />
                <span className="checkmark"></span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-xsmall"></div>
        <div className="grid">
          <FigmaButton
            buttonType="secondary"
            title={t("module:generateUsageDefinition")}
            id={"instantiater-intantiate-explanation-text"}
            onClick={() => applyInstantiater("explanation")}
          />
          <FigmaButton
            title={t("module:generate")}
            id={"instantiater-apply"}
            onClick={() => applyInstantiater("actual")}
          />
        </div>
      </div>
    </div>
  );
};

export default Instantiater;
