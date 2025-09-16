import React from 'react';
import { Chip } from '.';
import { useTranslation } from 'react-i18next';

/**
 * 數值鍵盤元件。
 * @param name Keyboard的名稱，元件會基於這個名稱自動產生相關class
 * @param chipOptions Keyboard的預設選項們
 * @function chipOnClick 當按下預設選項時，會執行的動作
 * @function chipCustomOnClick 當按下自訂選項時，會執行的動作
 * @function chipCustomOnChange 當輸入自訂選項時，會執行的動作
 */
interface ChipKeyboardProps {
  name: string;
  chipOptions: number[];
  chipOnClick: (num: number) => void;
  chipCustomOnClick: () => void;
  chipCustomOnChange: (num: number) => void;
  activeChip: string;
  inputedCustomNum: number;
}

const ChipKeyboard: React.FC<ChipKeyboardProps> = ({
  name,
  chipOptions,
  chipOnClick,
  chipCustomOnClick,
  chipCustomOnChange,
  activeChip,
  inputedCustomNum
}) => {
  const { t } = useTranslation(["module", "term"]);

  const handleCustomNumInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const numberValue = Number(value);

    if (!isNaN(numberValue)) { chipCustomOnChange(numberValue); }
  };

  return (
    <div className={`chip-keyboard ${name}-chip-keyboard border-radius-large border-1-cy-border-light padding-16 hide-scrollbar-vertical`}>
      <div className={`chip-keyboard-layout ${name}-chip-keyboard-layout`}>
        {chipOptions.map((item) =>
          <Chip
            label={String(item)}
            onClick={() => {
              chipOnClick(item)
            }}
            highlighted={activeChip === String(item) ? true : false}
          />
        )}
        <button
          className={`button chip chip-keyboard-chip-custom ${name}-chip-keyboard-chip-custom ${activeChip === "custom" ? "highlighted" : ""}`}
          onClick={chipCustomOnClick}
        >
          <span>{t("term:custom")}</span>
          <input
            className="cy-input"
            type="text"
            value={inputedCustomNum}
            onChange={handleCustomNumInput}
          />
        </button>
      </div>
    </div>
  );
};

export default ChipKeyboard;
