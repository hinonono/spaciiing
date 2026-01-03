import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';
import { strokeStyles } from '../module-frontend/arrowCreatorFrontEnd';
import ColorThumbnailView from './ColorThumbnailView';
import { CYStroke } from '../types/CYStroke';
import { useTranslation } from 'react-i18next';
import { SvgCornerRadius, SvgStrokeWeight } from '../assets/icons';
import StrokeCapSelector from './StrokeCapSelector';

interface StrokeEditorViewProps {
  editingStroke: CYStroke;
  setEditingStroke: React.Dispatch<React.SetStateAction<CYStroke>>;
}

const StrokeEditorView: React.FC<StrokeEditorViewProps> = ({
  editingStroke,
  setEditingStroke
}) => {
  const { t } = useTranslation(["module", "term"]);

  // 色彩與透明度
  const [editingColorHex, setEditingColorHex] = useState<string>(editingStroke.color.replace(/^#/, "").toUpperCase());

  useEffect(() => {
    setEditingColorHex(editingStroke.color.replace(/^#/, "").toUpperCase())
  }, [editingStroke.color])

  const handleColorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingColorHex(event.target.value); // Update temporary state while editing
  };

  const handleColorBlur = () => {
    setEditingStroke((prev) => ({ ...prev, color: `#${editingColorHex}` }));
  };

  const [editingOpacity, setEditingOpacity] = useState<number>(editingStroke.opacity * 100);
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
    setEditingStroke((prev) => ({ ...prev, opacity: editingOpacity / 100 }));
  }

  // 筆畫粗細
  const handleStrokeWeightChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const numberValue = Math.max(1, Number(event.target.value)); // Ensure strokeWeight is >= 1
    if (!isNaN(numberValue)) {
      setEditingStroke((prev) => ({ ...prev, strokeWeight: numberValue }));
    }
  };

  // 虛線與斷點
  const editingDash = React.useMemo(() => {
    if (editingStroke.dashAndGap && editingStroke.dashAndGap.length === 2) {
      return editingStroke.dashAndGap[0].toString();
    } else {
      return "0";
    }
  }, [editingStroke.dashAndGap]);

  const editingGap = React.useMemo(() => {
    if (editingStroke.dashAndGap && editingStroke.dashAndGap.length === 2) {
      return editingStroke.dashAndGap[1].toString();
    } else {
      return "0";
    }
  }, [editingStroke.dashAndGap]);

  const editingCustomDashAndGap = React.useMemo(() => {
    if (editingStroke.dashAndGap && editingStroke.dashAndGap.length > 2) {
      return editingStroke.dashAndGap.toString();
    } else {
      return "2,2,2,2";
    }
  }, [editingStroke.dashAndGap]);

  const handleDashChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDashString = event.target.value;
    const numberValue = Number(newDashString);
    const gap = editingStroke.dashAndGap?.[1] || 0;
    if (!isNaN(numberValue)) {
      setEditingStroke((prev) => ({ ...prev, dashAndGap: [numberValue, gap] }));
    }
  }

  const handleDashBlur = () => {
    const numberValue = Number(editingDash);
    const gap = editingStroke.dashAndGap?.[1] || 0;
    if (!isNaN(numberValue)) {
      setEditingStroke((prev) => ({ ...prev, dashAndGap: [numberValue, gap] }));
    }
  }

  const handleGapChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newGapString = event.target.value;
    const numberValue = Number(newGapString);
    const dash = editingStroke.dashAndGap?.[0] || 0;
    if (!isNaN(numberValue)) {
      setEditingStroke((prev) => ({ ...prev, dashAndGap: [dash, numberValue] }));
    }
  }

  const handleGapBlur = () => {
    const numberValue = Number(editingGap);
    const dash = editingStroke.dashAndGap?.[0] || 0;
    if (!isNaN(numberValue)) {
      setEditingStroke((prev) => ({ ...prev, dashAndGap: [dash, numberValue] }));
    }
  }

  const handleCustomDashAndGapChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCustomDashAndGapString = event.target.value;
    const parsedValues = newCustomDashAndGapString
      .split(',')
      .map((num) => num.trim())
      .filter((num) => !isNaN(Number(num)))
      .map(Number);
    setEditingStroke((prev) => ({ ...prev, dashAndGap: parsedValues }));
  }

  const handleCustomDashAndGapBlur = () => {
    const parsedValues = editingCustomDashAndGap
      .split(',')
      .map((num) => num.trim())
      .filter((num) => !isNaN(Number(num)))
      .map(Number);
    setEditingStroke((prev) => ({ ...prev, dashAndGap: parsedValues }));
  }


  // 筆畫圓角
  const handleCornerRadiusChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const numberValue = Number(event.target.value);
    if (!isNaN(numberValue)) {
      setEditingStroke((prev) => ({ ...prev, cornerRadius: numberValue }));
    }
  };

  // 筆畫樣式
  const strokeStyle = React.useMemo(() => {
    if (!editingStroke.dashAndGap) return "solid";
    if (editingStroke.dashAndGap.length === 2) return "dash";
    return "custom";
  }, [editingStroke.dashAndGap]);

  const handleStrokeStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    if (newStyle === "solid") {
      setEditingStroke((prev) => ({ ...prev, dashAndGap: undefined }));
    } else if (newStyle === "dash") {
      setEditingStroke((prev) => ({ ...prev, dashAndGap: [0, 0] }));
    } else if (newStyle === "custom") {
      setEditingStroke((prev) => ({ ...prev, dashAndGap: [2, 2, 2, 2] }));
    }
  };

  useEffect(() => {
    console.log("Editing stroke changed", editingStroke);
  }, [editingStroke]);

  // 起始點樣式
  const handleStartingPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditingStroke((prev) => ({ ...prev, startPointCap: e.target.value as StrokeCap }));
  };

  // 結束點樣式
  const handleEndPointStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditingStroke((prev) => ({ ...prev, endPointCap: e.target.value as StrokeCap }));
  };

  const handleColorPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setEditingColorHex(newColor); // Update textarea immediately
    setEditingStroke((prev) => ({ ...prev, color: newColor })); // Update stroke color
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
              value={editingStroke.color}
              onChange={handleColorPickerChange}
              style={{ display: "none" }}
            />
            {/* Clickable thumbnail to trigger color picker */}
            <div onClick={handleThumbnailClick} style={{ cursor: "pointer" }}>
              <ColorThumbnailView
                color={editingStroke.color}
                opacity={editingStroke.opacity}
                size={16}
                type={'square'}
                extraClassName="mr-xxsmall"
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
          <div className="width-100 textarea-with-icon">
            <div className="icon-20">
              <SvgStrokeWeight color={"var(--figma-color-text-secondary)"} />
            </div>
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={editingStroke.strokeWeight}
              onChange={handleStrokeWeightChange}
            />
          </div>
        </div>
        <div>
          <SectionTitle title={t("term:cornerRadius")} titleType="secondary" />
          <div className="width-100 textarea-with-icon">
            <div className="icon-20">
              <SvgCornerRadius color={"var(--figma-color-text-secondary)"} />
            </div>
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={editingStroke.cornerRadius}
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
              <SectionTitle title={t("term:strokeDash")} titleType="secondary" />
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
              <SectionTitle title={t("term:gap")} titleType="secondary" />
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
            <SectionTitle title={t("term:custom")} titleType="secondary" />
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
        <StrokeCapSelector
          titleKey={'module:startPoint'}
          value={editingStroke.startPointCap}
          onChange={handleStartingPointStyleChange}
        />
        <StrokeCapSelector
          titleKey={'module:endPoint'}
          value={editingStroke.endPointCap}
          onChange={handleEndPointStyleChange}
        />
      </div>
    </div>
  );
};

export default StrokeEditorView;
