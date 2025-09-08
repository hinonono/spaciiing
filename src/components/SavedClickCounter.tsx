import React from 'react';
import { useAppContext } from '../AppProvider';
import { useTranslation } from 'react-i18next';

interface SavedClickCounterProps {

}

const SavedClickCounter: React.FC<SavedClickCounterProps> = () => {
  const { editorPreference, licenseManagement } = useAppContext();
  const { t } = useTranslation(["license"]);

  return (
    licenseManagement.tier === "FREE" &&
    <div className='saved-click-counter'>{t("license:minSaved").replace("$SAVED_MIN$", `${editorPreference.savedClicks / 20}`)}</div>
  );
};

export default SavedClickCounter;
