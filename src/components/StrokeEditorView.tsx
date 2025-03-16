import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';
import { t } from 'i18next';
import { strokeCaps, strokeStyles } from '../module-frontend/arrowCreatorFrontEnd';
import ColorThumbnailView from './ColorThumbnailView';
import { CYStroke } from '../types/CYStroke';

interface StrokeEditorViewProps {
  stroke: CYStroke;
  setStroke: React.Dispatch<React.SetStateAction<CYStroke>>;
}

const StrokeEditorView: React.FC<StrokeEditorViewProps> = ({
  stroke,
  setStroke
}) => {
  // 色彩與透明度
  const [editingColorHex, setEditingColorHex] = useState<string>(stroke.color);

  const handleColorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingColorHex(event.target.value); // Update temporary state while editing
  };

  const handleColorBlur = () => {
    setStroke((prev) => ({ ...prev, color: editingColorHex }));
  };

  const [editingOpacity, setEditingOpacity] = useState<number>(stroke.opacity * 100);
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
    setStroke((prev) => ({ ...prev, opacity: editingOpacity / 100 }));
  }

  // 筆畫粗細
  const handleStrokeWeightChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const numberValue = Number(event.target.value);
    if (!isNaN(numberValue)) {
      setStroke((prev) => ({ ...prev, strokeWeight: numberValue }));
    }
  };

  // 虛線與斷點
  const handleDashChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const numberValue = Number(event.target.value);
    const gap = stroke.dashAndGap?.[1] === undefined ? 0 : stroke.dashAndGap?.[1];

    if (!isNaN(numberValue)) {
      setStroke((prev) => ({ ...prev, dashAndGap: [numberValue, gap] }));
    }
  }

  const handleGapChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const numberValue = Number(event.target.value);
    const dash = stroke.dashAndGap?.[0] === undefined ? 0 : stroke.dashAndGap?.[0];

    if (!isNaN(numberValue)) {
      setStroke((prev) => ({ ...prev, dashAndGap: [dash, numberValue] }));
    }
  }

  const handleCustomDashAndGapChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    // Split the string by comma, filter valid numbers, and parse them
    const parsedValues = value
      .split(',')
      .map((num) => num.trim())
      .filter((num) => !isNaN(Number(num)))
      .map(Number);

    setStroke((prev) => ({ ...prev, dashAndGap: parsedValues }));
  }


  // 筆畫圓角
  const handleCornerRadiusChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const numberValue = Number(event.target.value);
    if (!isNaN(numberValue)) {
      setStroke((prev) => ({ ...prev, cornerRadius: numberValue }));
    }
  };

  // 筆畫樣式
  const [strokeStyle, setStrokeStyle] = useState("");
  const handleStrokeStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setStrokeStyle(newStyle);
  }

  // 起始點樣式
  const handleStartingPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStroke((prev) => ({ ...prev, startPointCap: e.target.value as StrokeCap }));
  };

  // 結束點樣式
  const handleEndPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStroke((prev) => ({ ...prev, endPointCap: e.target.value as StrokeCap }));
  };

  return (
    <div>
      <div>
        <SectionTitle title="Color" titleType="secondary" />
        <div className="color-selector-wrapper">
          <div className="color-selector">
            <ColorThumbnailView color={`#${stroke.color}`} opacity={stroke.opacity} size={16} type={'square'} extraClassName='mr-xxxsmall' />
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
              value={editingOpacity}
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
              value={stroke.strokeWeight}
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
              value={stroke.cornerRadius}
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
        {strokeStyle === "dash" && (
          <div className='grid'>
            <div>
              <SectionTitle title="Dash" titleType="secondary" />
              <div className="width-100">
                <textarea
                  className="textarea textarea-height-fit-content"
                  rows={1}
                  value={stroke.dashAndGap?.[0]}
                  onChange={handleDashChange}
                />
              </div>
            </div>
            <div>
              <SectionTitle title="Gap" titleType="secondary" />
              <div className="width-100">
                <textarea
                  className="textarea textarea-height-fit-content"
                  rows={1}
                  value={stroke.dashAndGap?.[1]}
                  onChange={handleGapChange}
                />
              </div>
            </div>
          </div>
        )}
        {strokeStyle === "custom" && (
          <div>
            <SectionTitle title="Custom" titleType="secondary" />
            <div className="width-100">
              <textarea
                className="textarea textarea-height-fit-content"
                rows={1}
                value={stroke.dashAndGap?.toString()}
                onChange={handleCustomDashAndGapChange}
              />
            </div>
          </div>
        )}
      </div>
      <div className='grid mt-xxsmall'>
        <div>
          <SectionTitle title="Start point" titleType="secondary" />
          <select
            name="type"
            className="custom-select"
            value={stroke.startPointCap}
            onChange={handleStartingPointStyleChange}
          >
            {strokeCaps.map((item) => (
              <option key={item.value} value={item.value}>{item.labelKey}</option>
            ))}
          </select>
        </div>
        <div>
          <SectionTitle title="End point" titleType="secondary" />
          <select
            name="type"
            className="custom-select"
            value={stroke.endPointCap}
            onChange={handleEndPointStyleChange}
          >
            {strokeCaps.map((item) => (
              <option key={item.value} value={item.value}>{item.labelKey}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StrokeEditorView;
