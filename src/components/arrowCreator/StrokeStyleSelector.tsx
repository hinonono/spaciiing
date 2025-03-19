import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import FigmaButton from '../FigmaButton';
import { useAppContext } from '../../AppProvider';
import { CYStroke } from '../../types/CYStroke';
import { MessageSaveEditorPreference } from '../../types/Messages/MessageSaveEditorPreference';

interface StrokeStyleSelectorProps {
  setStroke: React.Dispatch<React.SetStateAction<CYStroke>>;
  handleOpenStrokeEditModal: () => void,
}

const StrokeStyleSelector: React.FC<StrokeStyleSelectorProps> = (
  {
    setStroke,
    handleOpenStrokeEditModal
  }
) => {
  const { editorPreference, setEditorPreference } = useAppContext();
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [savingPreference, setSavingPreference] = useState(false);

  const handleTargetChange = (option: CYStroke, id: string) => {
    setStroke(option);
    setSelectedStyleId(id);
  }

  const handleDelete = () => {
    if (selectedStyleId) {
      setEditorPreference((prev) => ({
        ...prev,
        strokeStyles: prev.strokeStyles.filter(style => style.id !== selectedStyleId)
      }));
      setSelectedStyleId(null);
      setSavingPreference(true);
    }
  };

  useEffect(() => {
    if (savingPreference) {
      const message: MessageSaveEditorPreference = {
        editorPreference: editorPreference,
        shouldSaveEditorPreference: true,
        module: "General",
        phase: "Actual"
      };

      parent.postMessage({ pluginMessage: message }, "*");
      setSavingPreference(false);
    }
  }, [editorPreference]); // Run when `editorPreference` updates

  const renderStrokeStyleList = () => {
    const s = editorPreference.strokeStyles;

    if (s && s.length > 0) {
      return (
        s.map((item) => (
          <label key={item.id} className={`container`}>
            <div className="flex flex-row align-items-center flex-justify-space-between">
              <div className="flex flex-row align-items-center">
                {item.name}
              </div>
              <input
                type="radio"
                name="strokeStyle"
                value={item.id}
                checked={selectedStyleId === item.id}
                onChange={() => handleTargetChange(item.style, item.id)}
              />
              <span className="checkmark checkmark-large"></span>
            </div>
          </label>
        ))
      )
    } else {
      return (
        <div className='flex justify-content-center text-color-secondary font-size-small'>There is no style in the list.</div>
      );
    }
  }

  return (
    <div className="list-view mt-xsmall">
      <div className="list-view-header property-clipboard-header">
        <div>
          <FigmaButton
            title={"Edit"}
            onClick={() => {
              if (selectedStyleId) {
                console.log("Editing style: ", selectedStyleId);
              }
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
            disabled={!selectedStyleId}
          />
        </div>
        <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
        </div>
        <div>
          <FigmaButton
            title={"Delete"}
            onClick={handleDelete}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
            disabled={!selectedStyleId}
          />
          <FigmaButton
            title={"New"}
            onClick={() => {
              handleOpenStrokeEditModal()
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        </div>
      </div>
      <div className="list-view-content border-1-top custom-checkbox-group">
        {renderStrokeStyleList()}
      </div>
    </div>
  );
};

export default StrokeStyleSelector;
