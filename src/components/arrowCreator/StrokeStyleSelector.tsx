import { t } from 'i18next';
import React from 'react';
import FigmaButton from '../FigmaButton';
import { useAppContext } from '../../AppProvider';
import { CYStroke } from '../../types/CYStroke';

interface StrokeStyleSelectorProps {
  setStroke: React.Dispatch<React.SetStateAction<CYStroke>>
}

const StrokeStyleSelector: React.FC<StrokeStyleSelectorProps> = (
  {
    setStroke
  }
) => {
  const { editorPreference, setEditorPreference } = useAppContext();

  const handleTargetChange = (option: CYStroke) => {
    setStroke(option);
  }

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
                type="checkbox"
                value={item.id}
                onChange={() => handleTargetChange(item.stlye)}
              />
              <span className="checkmark checkmark-large"></span>
            </div>
          </label>
        ))
      )
    } else {
      return (
        <div>There is no style in the list.</div>
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
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        </div>
        <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
        </div>
        <div>
          <FigmaButton
            title={"Delete"}
            onClick={() => {
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
          <FigmaButton
            title={"New"}
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
        {renderStrokeStyleList()}
      </div>
    </div>
  );
};

export default StrokeStyleSelector;
