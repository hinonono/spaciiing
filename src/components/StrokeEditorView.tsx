import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';
import { strokeCaps, strokeStyles } from '../module-frontend/arrowCreatorFrontEnd';
import ColorThumbnailView from './ColorThumbnailView';
import { CYStroke } from '../types/CYStroke';
import { useTranslation } from 'react-i18next';

interface StrokeEditorViewProps {
  stroke: CYStroke;
  setStroke: React.Dispatch<React.SetStateAction<CYStroke>>;
}

const StrokeEditorView: React.FC<StrokeEditorViewProps> = ({
  stroke,
  setStroke
}) => {
  const { t } = useTranslation(["module", "term"]);

  // 色彩與透明度
  const [editingColorHex, setEditingColorHex] = useState<string>(stroke.color.replace(/^#/, ""));

  useEffect(() => {
    setEditingColorHex(stroke.color.replace(/^#/, ""))
  }, [stroke.color])

  const handleColorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingColorHex(event.target.value); // Update temporary state while editing
  };

  const handleColorBlur = () => {
    setStroke((prev) => ({ ...prev, color: `#${editingColorHex}` }));
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

  // 虛線與斷點 - using temporary states for editing
  const [editingDash, setEditingDash] = useState<string>(stroke.dashAndGap?.[0]?.toString() || "");
  const [editingGap, setEditingGap] = useState<string>(stroke.dashAndGap?.[1]?.toString() || "");
  const [editingCustomDashAndGap, setEditingCustomDashAndGap] = useState<string>(stroke.dashAndGap?.toString() || "");

  const handleDashChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingDash(event.target.value); // Update UI only
  }

  const handleDashBlur = () => {
    const numberValue = Number(editingDash);
    const gap = stroke.dashAndGap?.[1] || 0;
    if (!isNaN(numberValue)) {
      setStroke((prev) => ({ ...prev, dashAndGap: [numberValue, gap] }));
    }
  }

  const handleGapChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingGap(event.target.value); // Update UI only
  }

  const handleGapBlur = () => {
    const numberValue = Number(editingGap);
    const dash = stroke.dashAndGap?.[0] || 0;
    if (!isNaN(numberValue)) {
      setStroke((prev) => ({ ...prev, dashAndGap: [dash, numberValue] }));
    }
  }

  const handleCustomDashAndGapChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingCustomDashAndGap(event.target.value); // Update UI only
  }

  const handleCustomDashAndGapBlur = () => {
    const parsedValues = editingCustomDashAndGap
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

    if (newStyle === "solid" || newStyle === "dash") {
      setStroke((prev) => ({ ...prev, dashAndGap: [0, 0] }));
    }
  }

  // 起始點樣式
  const handleStartingPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStroke((prev) => ({ ...prev, startPointCap: e.target.value as StrokeCap }));
  };

  // 結束點樣式
  const handleEndPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStroke((prev) => ({ ...prev, endPointCap: e.target.value as StrokeCap }));
  };

  const handleColorPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setEditingColorHex(newColor); // Update textarea immediately
    setStroke((prev) => ({ ...prev, color: newColor })); // Update stroke color
  };

  const handleThumbnailClick = () => {
    document.getElementById("colorPickerInput")?.click();
  };

  return (
    <div>
      <div>
        <SectionTitle title={t("term:color")} titleType="secondary" />
        <div className="color-selector-wrapper">
          <div className="color-selector">
            {/* Hidden color picker input */}
            <input
              id="colorPickerInput"
              type="color"
              value={stroke.color}
              onChange={handleColorPickerChange}
              style={{ display: "none" }}
            />
            {/* Clickable thumbnail to trigger color picker */}
            <div onClick={handleThumbnailClick} style={{ cursor: "pointer" }}>
              <ColorThumbnailView
                color={stroke.color}
                opacity={stroke.opacity}
                size={16}
                type={'square'}
                extraClassName="mr-xxxsmall"
              />
            </div>
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
          <SectionTitle title={t("term:strokeWeight")} titleType="secondary" />
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
          <SectionTitle title={t("term:cornerRadius")} titleType="secondary" />
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
          <SectionTitle title={t("term:strokeStyle")} titleType="secondary" />
          <select
            name="type"
            className="custom-select"
            value={strokeStyle}
            onChange={handleStrokeStyleChange}
          >
            {strokeStyles.map((item) => (
              <option key={item.type} value={item.type}>{t(item.labelKey)}</option>
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
                  value={editingDash}
                  onChange={handleDashChange}
                  onBlur={handleDashBlur}
                />
              </div>
            </div>
            <div>
              <SectionTitle title="Gap" titleType="secondary" />
              <div className="width-100">
                <textarea
                  className="textarea textarea-height-fit-content"
                  rows={1}
                  value={editingGap}
                  onChange={handleGapChange}
                  onBlur={handleGapBlur}
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
                value={editingCustomDashAndGap}
                onChange={handleCustomDashAndGapChange}
                onBlur={handleCustomDashAndGapBlur}
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
              <option key={item.value} value={item.value}>{t(item.labelKey)}</option>
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
              <option key={item.value} value={item.value}>{t(item.labelKey)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StrokeEditorView;
