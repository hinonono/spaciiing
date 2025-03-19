import React, { useEffect, useState } from 'react';
import FigmaButton from '../FigmaButton';
import { useAppContext } from '../../AppProvider';
import { CYStroke } from '../../types/CYStroke';
import { MessageSaveEditorPreference } from '../../types/Messages/MessageSaveEditorPreference';
import ColorThumbnailView from '../ColorThumbnailView';
import { defaultStroke } from '../../module-frontend/arrowCreatorFrontEnd';

interface StrokeStyleSelectorProps {
  setEditStroke: React.Dispatch<React.SetStateAction<CYStroke>>;
  handleOpenStrokeEditModal: (existingStyleName: string | undefined, existingStyleId: string | undefined) => void,
  setStrokeModalMode: React.Dispatch<React.SetStateAction<"edit" | "create">>,
}

const StrokeStyleSelector: React.FC<StrokeStyleSelectorProps> = (
  {
    handleOpenStrokeEditModal,
    setEditStroke,
    setStrokeModalMode,
  }
) => {
  const { editorPreference, setEditorPreference } = useAppContext();
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(
    editorPreference.strokeStyles.length > 0 ? editorPreference.strokeStyles[0].id : null
  );
  const [savingPreference, setSavingPreference] = useState(false);

  const handleTargetChange = (option: CYStroke, id: string) => {
    setEditStroke(option);
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

  useEffect(() => {
    if (editorPreference.strokeStyles.length > 0) {
      const firstStroke = editorPreference.strokeStyles[0];
      setSelectedStyleId(firstStroke.id);
      setEditStroke(firstStroke.style);
    }
  }, [editorPreference.strokeStyles]); // Runs when `strokeStyles` update

  const renderStrokeStyleList = () => {
    const s = editorPreference.strokeStyles;

    if (s && s.length > 0) {
      return (
        s.map((item) => (
          <label key={item.id} className={`container`}>
            <div className="flex flex-row align-items-center flex-justify-space-between">
              <div className="flex flex-row align-items-center">
                <ColorThumbnailView color={item.style.color} opacity={1} size={20} type={"rounded"} extraClassName="mr-xxxsmall" />
                {item.name}
              </div>
              <input
                type="radio"
                name="strokeStyle"
                value={item.id}
                checked={selectedStyleId === item.id}
                onChange={() => handleTargetChange(item.style, item.id)}
              />
              <span className="checkmark checkmark-round checkmark-large"></span>
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
                const foundStroke = editorPreference.strokeStyles.find(style => style.id === selectedStyleId);
                if (!foundStroke) {
                  console.warn("No stroke found for the selected ID:", selectedStyleId);
                  return;
                }
                setEditStroke(foundStroke.style);
                setStrokeModalMode("edit");
                handleOpenStrokeEditModal(foundStroke.name, foundStroke.id);
                setSelectedStyleId(foundStroke.id);
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
              setStrokeModalMode("create")
              setEditStroke(defaultStroke);
              handleOpenStrokeEditModal(undefined, undefined)
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        </div>
      </div>
      <div className="list-view-content border-1-top cy-checkbox-group">
        {renderStrokeStyleList()}
      </div>
    </div>
  );
};

export default StrokeStyleSelector;
