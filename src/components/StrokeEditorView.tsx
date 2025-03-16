import React, { useState } from 'react';
import SectionTitle from './SectionTitle';
import { t } from 'i18next';

interface StrokeEditorViewProps {

}

const StrokeEditorView: React.FC<StrokeEditorViewProps> = () => {

  // 筆畫粗細
  const [strokeWeight, setStrokeWeight] = useState<number>(0);
  const handleStrokeWeightChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      setStrokeWeight(numberValue);
    }
  };

  // 筆畫圓角
  const [cornerRadius, setCornerRadius] = useState<number>(0);
  const handleCornerRadiusChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      setCornerRadius(numberValue);
    }
  };

  return (
    <div>
      <div>
        <SectionTitle title="Color" titleType="secondary" />
      </div>
      <div className='grid'>
        <div>
          <SectionTitle title="Weight" titleType="secondary" />
          <div className="width-100 mt-xxsmall">
            <SectionTitle title={"Margin"} titleType="secondary" />
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={strokeWeight}
              onChange={handleStrokeWeightChange}
            />
          </div>
        </div>
        <div>
          <SectionTitle title="Radius" titleType="secondary" />
          <div className="width-100 mt-xxsmall">
            <SectionTitle title={"Margin"} titleType="secondary" />
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={cornerRadius}
              onChange={handleCornerRadiusChange}
            />
          </div>
        </div>
      </div>
      <div className='grid'>
        <div>
          <SectionTitle title="Stroke style" titleType="secondary" />
        </div>
      </div>
      <div className='grid'>
        <div>
          <SectionTitle title="Start point" titleType="secondary" />
        </div>
        <div>
          <SectionTitle title="End point" titleType="secondary" />
        </div>
      </div>
    </div>
  );
};

export default StrokeEditorView;
