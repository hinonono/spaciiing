import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';
import { t } from 'i18next';
import { strokePointStyles, strokeStyles } from '../module-frontend/arrowCreatorFrontEnd';
import ColorThumbnailView from './ColorThumbnailView';

interface StrokeEditorViewProps {

}

const StrokeEditorView: React.FC<StrokeEditorViewProps> = () => {
  // 色彩與透明度
  const [colorHex, setColorHex] = useState<string>("000000"); // Ensure default color is valid
  const [editingColorHex, setEditingColorHex] = useState<string>(colorHex);

  const handleColorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingColorHex(event.target.value); // Update temporary state while editing
  };

  const handleColorBlur = () => {
    setColorHex(editingColorHex); // Update actual color after editing is finished
  };

  const [opacity, setOpacity] = useState<number>(100);
  const [editingOpacity, setEditingOpacity] = useState<number>(opacity);
  const handleOpacityChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      setEditingOpacity(numberValue);
    }
  }

  const handleOpacityBlur = () => {
    setOpacity(editingOpacity);
  }

  // 筆畫粗細
  const [strokeWeight, setStrokeWeight] = useState<number>(1);
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

  // 筆畫樣式
  const [strokeStyle, setStrokeStyle] = useState("");
  const handleStrokeStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setStrokeStyle(newStyle);
  }

  // 起始點樣式
  const [startingPointStyle, setStartingPointStyle] = useState("");
  const handleStartingPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setStartingPointStyle(newStyle);
  };

  // 結束點樣式
  const [endPointStyle, setEndPointStyle] = useState("");
  const handleEndPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setEndPointStyle(newStyle);
  };

  return (
    <div>
      <div>
        <SectionTitle title="Color" titleType="secondary" />
        <div className="color-selector-wrapper">
          <div className="color-selector">
            <ColorThumbnailView color={`#${colorHex}`} opacity={opacity / 100} size={16} type={'square'} extraClassName='mr-xxxsmall' />
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={editingColorHex}
              onChange={handleColorChange}
              onBlur={handleColorBlur} // Update color when user finishes editing
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevents line break
                }
              }}
            />
          </div>
          <div className="color-selector">
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={opacity}
              onChange={handleOpacityChange}
              onBlur={handleOpacityBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevents line break
                }
              }}
            />
            <span className='text-color-secondary'>%</span>
          </div>
        </div>
      </div>
      <div className='grid mt-xxsmall'>
        <div>
          <SectionTitle title="Weight" titleType="secondary" />
          <div className="width-100">
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
          <div className="width-100">
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={cornerRadius}
              onChange={handleCornerRadiusChange}
            />
          </div>
        </div>
      </div>
      <div className='grid mt-xxsmall'>
        <div>
          <SectionTitle title="Stroke style" titleType="secondary" />
          <select
            name="type"
            className="custom-select"
            value={strokeStyle}
            onChange={handleStrokeStyleChange}
          >
            {strokeStyles.map((item) => (
              <option key={item.type} value={item.type}>{item.labelKey}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='grid mt-xxsmall'>
        <div>
          <SectionTitle title="Start point" titleType="secondary" />
          <select
            name="type"
            className="custom-select"
            value={startingPointStyle}
            onChange={handleStartingPointStyleChange}
          >
            {strokePointStyles.map((item) => (
              <option key={item.type} value={item.type}>{item.labelKey}</option>
            ))}
          </select>
        </div>
        <div>
          <SectionTitle title="End point" titleType="secondary" />
          <select
            name="type"
            className="custom-select"
            value={endPointStyle}
            onChange={handleEndPointStyleChange}
          >
            {strokePointStyles.map((item) => (
              <option key={item.type} value={item.type}>{item.labelKey}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StrokeEditorView;
