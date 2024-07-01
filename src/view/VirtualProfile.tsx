import React, { useEffect, useState } from "react";
import { FigmaButton, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import {
  MessageVirtualProfileSingleValue,
  MessageVirtualProfileWholeObject,
} from "../types/Message";
import { VirtualProfile } from "../types/VirtualProfile";
import Modal from "../components/Modal";

type CategoryKey = "personal" | "employment" | "financial" | "custom";

const VirtualProfile: React.FC = () => {
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const { virtualProfile, setVirtualProfile } = useAppContext();
  const [previousVirtualProfile, setPreviousVirtualProfile] =
    useState<VirtualProfile | null>(null);

  const handleInputChange = (key: string, value: string) => {
    console.log("Input Changed");

    setVirtualProfile({ ...virtualProfile, [key]: value });
  };

  const applyVirtualProfile = (key: string) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const value = virtualProfile[key as keyof VirtualProfile]; // Get the value for the given key

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
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageVirtualProfileWholeObject = {
      virtualProfile: virtualProfile,
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

    setPreviousVirtualProfile(virtualProfile);
  };

  useEffect(() => {
    renderTableContent();
  }, [virtualProfile]);

  const renderTableContent = () => {
    const categories: Record<CategoryKey, string[]> = {
      personal: [
        "username",
        "userId",
        "name",
        "nickname",
        "age",
        "gender",
        "birthday",
        "email",
        "country",
        "city",
        "address",
        "landlineNum",
        "phoneNum",
      ],
      employment: [
        "jobTitle",
        "industry",
        "companyName",
        "companyAddress",
        "companyPhoneNum",
      ],
      financial: ["cardNum", "expirationDate", "cvv", "cardNetwork"],
      custom: ["custom1", "custom2", "custom3"],
    };

    const rows = [
      { key: "username", title: "Username", value: virtualProfile.username },
      { key: "userId", title: "User ID", value: virtualProfile.userId },
      {
        key: "expirationDate",
        title: "Expiration Date",
        value: virtualProfile.expirationDate,
      },
      { key: "cvv", title: "CVV", value: virtualProfile.cvv },
      {
        key: "cardNetwork",
        title: "Card Network",
        value: virtualProfile.cardNetwork,
      },
      { key: "jobTitle", title: "Job Title", value: virtualProfile.jobTitle },
      { key: "industry", title: "Industry", value: virtualProfile.industry },
      { key: "city", title: "City", value: virtualProfile.city },
      { key: "name", title: "Name", value: virtualProfile.name },
      { key: "nickname", title: "Nickname", value: virtualProfile.nickname },
      { key: "age", title: "Age", value: virtualProfile.age },
      { key: "gender", title: "Gender", value: virtualProfile.gender },
      { key: "birthday", title: "Birthday", value: virtualProfile.birthday },
      { key: "email", title: "Email", value: virtualProfile.email },
      { key: "country", title: "Country", value: virtualProfile.country },
      { key: "cardNum", title: "Card Number", value: virtualProfile.cardNum },
      {
        key: "landlineNum",
        title: "Landline Number",
        value: virtualProfile.landlineNum,
      },
      {
        key: "phoneNum",
        title: "Phone Number",
        value: virtualProfile.phoneNum,
      },
      { key: "address", title: "Address", value: virtualProfile.address },
      {
        key: "companyName",
        title: "Company Name",
        value: virtualProfile.companyName,
      },
      {
        key: "companyAddress",
        title: "Company Address",
        value: virtualProfile.companyAddress,
      },
      {
        key: "companyPhoneNum",
        title: "Company Phone Number",
        value: virtualProfile.companyPhoneNum,
      },
      {
        key: "custom1",
        title: "Custom Field 1",
        value: virtualProfile.custom1,
      },
      {
        key: "custom2",
        title: "Custom Field 2",
        value: virtualProfile.custom2,
      },
      {
        key: "custom3",
        title: "Custom Field 3",
        value: virtualProfile.custom3,
      },
    ];

    const categorizedRows = Object.keys(categories).map((category) => {
      const categoryRows = rows.filter((row) =>
        categories[category as CategoryKey].includes(row.key)
      );
      return (
        <div key={category} className="category">
          <div className="table-row category-title">
            <div className="table-cell">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
          </div>
          {categoryRows.map((row, index) => (
            <div
              key={row.key}
              className="table-row"
              onMouseEnter={() => setHoveredRowIndex(index)}
              onMouseLeave={() => setHoveredRowIndex(null)}
            >
              <div className="table-cell">
                {hoveredRowIndex === index && (
                  <div className="content-wrap">
                    <button onClick={() => applyVirtualProfile(row.key)}>
                      Apply
                    </button>
                  </div>
                )}
              </div>
              <div className="table-cell virtual-profile-title">
                <div className="content-wrap">{row.title}</div>
              </div>
              <div className="table-cell">
                <div className="content-wrap">
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handleInputChange(row.key, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    });

    return <div className="table-content">{categorizedRows}</div>;
  };

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>Virtual Profile</h3>
          <p>
            Virtual profile lets you easily unify and manage the dummy data used
            across your design.{" "}
          </p>
          <h4>Edit and Apply</h4>
          <p>
            You can edit the value by clicking the corresponding field. To apply
            the value, just select one or multiple layers, then click "Apply"
            button.
          </p>
          <h4>Save your change</h4>
          <p>
            By default, the plugin will automatically save your changes.
            However, due to limitations of the plugin API, there might be
            occasions when your changes cannot be saved automatically. <br />
            <br />
            To avoid any loss of your changes, it is recommended to always use
            the save button at the top of the page.
          </p>
        </div>
      </Modal>
      <TitleBar
        title="Virtual Profile"
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        <FigmaButton
          buttonType="secondary"
          title={"Save"}
          id={"virtual-profile-save"}
          onClick={saveVirtualProfile}
          disabled={virtualProfile == previousVirtualProfile ? true : false}
        />
      </div>
      <div>
        <div className="table">
          <div className="table-row table-header">
            <div className="table-cell">Apply</div>
            <div className="table-cell">Title</div>
            <div className="table-cell">Value</div>
          </div>
          {renderTableContent()}
        </div>
      </div>
    </div>
  );
};

export default VirtualProfile;
