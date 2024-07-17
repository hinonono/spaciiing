import React, { useEffect, useState } from "react";
import { FigmaButton, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import {
  MessageVirtualProfileSingleValue,
  MessageVirtualProfileWholeObject,
} from "../types/Message";
import { VirtualProfile, VirtualProfileGroup } from "../types/VirtualProfile";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import VirtualProfileNew from "./VirtualProfileNew";
import { SvgSave } from "../assets/icons";

type CategoryKey = "personal" | "employment" | "financial" | "custom";

const VirtualProfile: React.FC = () => {
  const { t } = useTranslation(["module"]);
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const { virtualProfileGroups } = useAppContext();
  const [previousVirtualProfile, setPreviousVirtualProfile] = useState<
    VirtualProfileGroup[] | null
  >(null);

  // const handleInputChange = (key: string, value: string) => {
  //   console.log("Input Changed");

  //   setVirtualProfile({ ...virtualProfile, [key]: value });
  // };

  // const applyVirtualProfile = (key: string) => {
  //   const isDevelopment = process.env.REACT_APP_ENV === "development";

  //   if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
  //     setShowCTSubscribe(true);
  //     return;
  //   }

  //   const value = virtualProfile[key as keyof VirtualProfile]; // Get the value for the given key

  //   const message: MessageVirtualProfileSingleValue = {
  //     module: "VirtualProfile",
  //     direction: "Inner",
  //     virtualProfileKey: key,
  //     virtualProfileValue: value,
  //     phase: "Actual",
  //   };

  //   parent.postMessage(
  //     {
  //       pluginMessage: message,
  //     },
  //     "*"
  //   );
  // };

  const applyVirtualProfile = (key: string, value: string) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageVirtualProfileSingleValue = {
      module: "VirtualProfile",
      direction: "Inner",
      virtualProfileKey: key,
      virtualProfileValue: value,
      phase: "Actual",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const saveVirtualProfile = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageVirtualProfileWholeObject = {
      // virtualProfile: virtualProfile,
      virtualProfileGroups: virtualProfileGroups,
      module: "VirtualProfile",
      phase: "WillEnd",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );

    setPreviousVirtualProfile(virtualProfileGroups);
  };

  // useEffect(() => {
  //   renderTableContent();
  // }, [virtualProfile]);

  // const renderTableContent = () => {
  //   const categories: Record<
  //     CategoryKey,
  //     { nameKey: string; members: string[] }
  //   > = {
  //     personal: {
  //       nameKey: "module:personal",
  //       members: [
  //         "username",
  //         "userId",
  //         "name",
  //         "nickname",
  //         "age",
  //         "gender",
  //         "birthday",
  //         "email",
  //         "country",
  //         "city",
  //         "address",
  //         "landlineNum",
  //         "phoneNum",
  //       ],
  //     },
  //     employment: {
  //       nameKey: "module:employment",
  //       members: [
  //         "jobTitle",
  //         "industry",
  //         "companyName",
  //         "companyAddress",
  //         "companyPhoneNum",
  //       ],
  //     },
  //     financial: {
  //       nameKey: "module:financial",
  //       members: ["cardNum", "expirationDate", "cvv", "cardNetwork"],
  //     },
  //     custom: {
  //       nameKey: "module:custom",
  //       members: ["custom1", "custom2", "custom3"],
  //     },
  //   };

  //   const rows = [
  //     {
  //       key: "username",
  //       title: t("module:virtualProfileUsername"),
  //       value: virtualProfile.username,
  //     },
  //     {
  //       key: "userId",
  //       title: t("module:virtualProfileUserId"),
  //       value: virtualProfile.userId,
  //     },
  //     {
  //       key: "expirationDate",
  //       title: t("module:virtualProfileExpirationDate"),
  //       value: virtualProfile.expirationDate,
  //     },
  //     {
  //       key: "cvv",
  //       title: t("module:virtualProfileCvv"),
  //       value: virtualProfile.cvv,
  //     },
  //     {
  //       key: "cardNetwork",
  //       title: t("module:virtualProfileCardNetwork"),
  //       value: virtualProfile.cardNetwork,
  //     },
  //     {
  //       key: "jobTitle",
  //       title: t("module:virtualProfileJobTitle"),
  //       value: virtualProfile.jobTitle,
  //     },
  //     {
  //       key: "industry",
  //       title: t("module:virtualProfileIndustry"),
  //       value: virtualProfile.industry,
  //     },
  //     {
  //       key: "city",
  //       title: t("module:virtualProfileCity"),
  //       value: virtualProfile.city,
  //     },
  //     {
  //       key: "name",
  //       title: t("module:virtualProfileName"),
  //       value: virtualProfile.name,
  //     },
  //     {
  //       key: "nickname",
  //       title: t("module:virtualProfileNickname"),
  //       value: virtualProfile.nickname,
  //     },
  //     {
  //       key: "age",
  //       title: t("module:virtualProfileAge"),
  //       value: virtualProfile.age,
  //     },
  //     {
  //       key: "gender",
  //       title: t("module:virtualProfileGender"),
  //       value: virtualProfile.gender,
  //     },
  //     {
  //       key: "birthday",
  //       title: t("module:virtualProfileBirthday"),
  //       value: virtualProfile.birthday,
  //     },
  //     {
  //       key: "email",
  //       title: t("module:virtualProfileEmail"),
  //       value: virtualProfile.email,
  //     },
  //     {
  //       key: "country",
  //       title: t("module:virtualProfileCountry"),
  //       value: virtualProfile.country,
  //     },
  //     {
  //       key: "cardNum",
  //       title: t("module:virtualProfileCardNum"),
  //       value: virtualProfile.cardNum,
  //     },
  //     {
  //       key: "landlineNum",
  //       title: t("module:virtualProfileLandlineNum"),
  //       value: virtualProfile.landlineNum,
  //     },
  //     {
  //       key: "phoneNum",
  //       title: t("module:virtualProfilePhoneNum"),
  //       value: virtualProfile.phoneNum,
  //     },
  //     {
  //       key: "address",
  //       title: t("module:virtualProfileAddress"),
  //       value: virtualProfile.address,
  //     },
  //     {
  //       key: "companyName",
  //       title: t("module:virtualProfileCompanyName"),
  //       value: virtualProfile.companyName,
  //     },
  //     {
  //       key: "companyAddress",
  //       title: t("module:virtualProfileCompanyAddress"),
  //       value: virtualProfile.companyAddress,
  //     },
  //     {
  //       key: "companyPhoneNum",
  //       title: t("module:virtualProfileCompanyPhoneNum"),
  //       value: virtualProfile.companyPhoneNum,
  //     },
  //     {
  //       key: "custom1",
  //       title: t("module:virtualProfileCustom1"),
  //       value: virtualProfile.custom1,
  //     },
  //     {
  //       key: "custom2",
  //       title: t("module:virtualProfileCustom2"),
  //       value: virtualProfile.custom2,
  //     },
  //     {
  //       key: "custom3",
  //       title: t("module:virtualProfileCustom3"),
  //       value: virtualProfile.custom3,
  //     },
  //   ];

  //   const categorizedRows = Object.keys(categories).map((category) => {
  //     const categoryRows = rows.filter((row) =>
  //       categories[category as CategoryKey].members.includes(row.key)
  //     );
  //     return (
  //       <div key={category} className="category">
  //         <div className="table-row category-title">
  //           <div className="table-cell">
  //             {t(categories[category as CategoryKey].nameKey)}
  //             {/* {category.charAt(0).toUpperCase() + category.slice(1)} */}
  //           </div>
  //           <div className="table-cell"></div>
  //           <div className="table-cell"></div>
  //         </div>
  //         {categoryRows.map((row, index) => (
  //           <div
  //             key={row.key}
  //             className="table-row"
  //             onMouseEnter={() => setHoveredRowIndex(index)}
  //             onMouseLeave={() => setHoveredRowIndex(null)}
  //           >
  //             <div className="table-cell">
  //               {hoveredRowIndex === index && (
  //                 <div className="content-wrap">
  //                   {/* <button onClick={() => applyVirtualProfile(row.key)}>
  //                     {t("module:apply")}
  //                   </button> */}
  //                 </div>
  //               )}
  //             </div>
  //             <div className="table-cell virtual-profile-title">
  //               <div className="content-wrap">{row.title}</div>
  //             </div>
  //             <div className="table-cell">
  //               <div className="content-wrap">
  //                 <input
  //                   type="text"
  //                   value={row.value}
  //                   onChange={(e) => handleInputChange(row.key, e.target.value)}
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   });

  //   return <div className="table-content">{categorizedRows}</div>;
  // };

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>{t("module:moduleVirtualProfile")}</h3>
          <p>{t("module:moduleVirtualProfileDesc")}</p>
          <h4>{t("module:editAndApply")}</h4>
          <p>{t("module:editAndApplyDesc")}</p>
          <h4>{t("module:saveYourChange")}</h4>
          <p>{t("module:saveYourChangeDesc")}</p>
        </div>
      </Modal>
      <TitleBar
        title={t("module:moduleVirtualProfile")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* <FigmaButton
          buttonType="secondary"
          title={t("module:save")}
          id={"virtual-profile-save"}
          onClick={saveVirtualProfile}
          disabled={
            virtualProfileGroups == previousVirtualProfile ? true : false
          }
        /> */}
        <VirtualProfileNew
          applyVirtualProfile={applyVirtualProfile}
          saveVirtualProfile={saveVirtualProfile}
          previousVirtualProfile={previousVirtualProfile}
        />
      </div>
      {/* <div>
        <div className="table">
          <div className="table-row table-header">
            <div className="table-cell">{t("module:apply")}</div>
            <div className="table-cell">{t("module:title")}</div>
            <div className="table-cell">{t("module:value")}</div>
          </div>
          {renderTableContent()}
        </div>
      </div> */}
    </div>
  );
};

export default VirtualProfile;
