import React from 'react';
import FigmaButton from '../FigmaButton';
import StrokeEditorView from '../StrokeEditorView';
import { CYStroke } from '../../types/CYStroke';

interface StrokeEditorProps {
  editingStroke: CYStroke
  setEditingStroke: React.Dispatch<React.SetStateAction<CYStroke>>,
  handleOpenStrokeEditModal: (existingStyleName: string | undefined, existingStyleId: string | undefined) => void,
  setStrokeModalMode: React.Dispatch<React.SetStateAction<"create" | "edit">>,
}

const StrokeEditor: React.FC<StrokeEditorProps> = (
  {
    editingStroke,
    setEditingStroke,
    handleOpenStrokeEditModal,
    setStrokeModalMode
  }
) => {

  return (
    <div className="list-view mt-xsmall">
      <div className="list-view-header property-clipboard-header">
        <div></div>
        <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
        </div>
        <div>
          <FigmaButton
            title={"Save style"}
            onClick={() => {
              console.log("save style button was clicked.");
              setStrokeModalMode("create");
              handleOpenStrokeEditModal(undefined, undefined)
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        </div>
      </div>
      <div className="padding-16 border-1-top">
        <StrokeEditorView editingStroke={editingStroke} setEditingStroke={setEditingStroke} />
      </div>
    </div>
  );
};

export default StrokeEditor;
