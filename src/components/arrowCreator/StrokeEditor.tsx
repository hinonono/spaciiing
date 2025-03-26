import React from 'react';
import FigmaButton from '../FigmaButton';
import StrokeEditorView from '../StrokeEditorView';
import { CYStroke } from '../../types/CYStroke';
import { useTranslation } from 'react-i18next';
import ListViewHeader from '../ListViewHeader';

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

  const { t } = useTranslation(["module"])

  return (
    <div className="list-view mt-xsmall">
      <ListViewHeader
        additionalClass={"property-clipboard-header"}
        title={""}
        rightItem={
          <FigmaButton
            title={t("module:saveStyle")}
            onClick={() => {
              setStrokeModalMode("create");
              handleOpenStrokeEditModal(undefined, undefined)
            }}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        }
      />
      <div className="padding-16 border-1-top">
        <StrokeEditorView editingStroke={editingStroke} setEditingStroke={setEditingStroke} />
      </div>
    </div>
  );
};

export default StrokeEditor;
