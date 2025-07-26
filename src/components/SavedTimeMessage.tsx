import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../AppProvider';

interface SavedTimeMessageProps {

}

const SavedTimeMessage: React.FC<SavedTimeMessageProps> = () => {
  const { editorPreference } = useAppContext();
  const { t } = useTranslation(["license"]);

  return (
    <span className="note note-large">
      {t("license:youSaved")
        .replace("$SAVED_CLICKS$", `${editorPreference.savedClicks}`)
        .replace("$SAVED_MIN$", `${Math.round(editorPreference.savedClicks / 20)}`)
      }
      {t("license:saveTimeAsWell")
        .replace("$SAVED_TIME$", `${editorPreference.savedSecs / 60}`)
      }
    </span>
  );
};

export default SavedTimeMessage;
