import React from "react";
import { SvgInfo } from "../assets/icons";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";

interface TitleBarProps {
  title: string;
  children?: React.ReactNode;
  onClick?: () => void;
  showInfoIcon?: boolean;
  isProFeature?: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  children,
  onClick,
  showInfoIcon = true,
  isProFeature = false,
}) => {
  const isDevelopment = process.env.REACT_APP_ENV === "development";
  const { licenseManagement, setShowCTSubscribe } = useAppContext();
  const { t } = useTranslation(["license"]);

  return (
    <div className="title-bar">
      
      <div className="content-wrap">
        <h5 className="func-title">{title.toUpperCase()}</h5>
        {children && <div className="title-bar-children">{children}</div>}
        {!licenseManagement.isLicenseActive &&
          isProFeature &&
          !isDevelopment && (
            <div
              className="badge ml-xxsmall"
              onClick={() => setShowCTSubscribe(true)}
            >
              {t("license:pro")}
            </div>
          )}
        {showInfoIcon && (
          <div className="ml-xxxsmall tooltip">
            <div className="icon-20 icon-hover" onClick={onClick}>
              <SvgInfo color="var(--tooltip-icon)" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleBar;
