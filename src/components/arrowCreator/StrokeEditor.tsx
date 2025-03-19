import React from 'react';
import FigmaButton from '../FigmaButton';
import StrokeEditorView from '../StrokeEditorView';
import { CYStroke } from '../../types/CYStroke';

interface StrokeEditorProps {
  stroke: CYStroke
  setStroke: React.Dispatch<React.SetStateAction<CYStroke>>
}

const StrokeEditor: React.FC<StrokeEditorProps> = (
  {
    stroke,
    setStroke
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
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        </div>
      </div>
      <div className="padding-16 border-1-top">
        <StrokeEditorView stroke={stroke} setStroke={setStroke} />
      </div>
    </div>
  );
};

export default StrokeEditor;
