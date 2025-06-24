import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../AppProvider';

interface SavedTimeMessageProps {

}

const SavedTimeMessage: React.FC<SavedTimeMessageProps> = () => {
  const { editorPreference } = useAppContext();
  const { t } = useTranslation(["license"]);

  return (
    <span className="note note-large special">
      {t("license:youSaved")
        .replace("$SAVED_CLICKS$", `${editorPreference.savedClicks}`)
        .replace("$SAVED_MIN$", `${editorPreference.savedClicks / 20}`)
        .replace("$SAVED_TIME$", `${editorPreference.savedSecs / 60}`)
      }
    </span>
  );
};

export default SavedTimeMessage;
