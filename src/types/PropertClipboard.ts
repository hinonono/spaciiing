export type PropertyClipboardSupportedProperty =
  | "WIDTH"
  | "HEIGHT"
  | "WIDTH_AND_HEIGHT"
  | "LAYER_OPACITY"
  | "LAYER_CORNER_RADIUS"
  | "LAYER_BLEND_MODE"
  | PropertyClipboardSupportedFill
  | PropertyClipboardSupportedStroke
  | PropertyClipboardSupportedEffect
  | PropertyClipboardSupportedTypography
  | PropertyClipboardSupportedAutoLayout
  | "EXPORT_SETTINGS";

export interface ComponentPropertiesFrontEnd {
  nodeId: string;
  propertyName: string;
  value: string | boolean;
  layerName: string;
}

export interface ReferenceObject {
  name: string;
  id: string;
  layerType: string;
}

type PropertyClipboardSupportedAutoLayout = 
| "LAYOUT_MODE"
| "AUTOLAYOUT_ALIGNMENT"
| "AUTOLAYOUT_GAP"
| "AUTOLAYOUT_PADDING_HORITONTAL"
| "AUTOLAYOUT_PADDING_VERTICAL"
| "AUTOLAYOUT_CLIP_CONTENT"

type PropertyClipboardSupportedFill =
  | "FILL_ALL"
  | "FILL_SOLID"
  | "FILL_GRADIENT"
  | "FILL_IMAGE"
  | "FILL_VIDEO";

type PropertyClipboardSupportedStroke =
  | "STROKES"
  | "STROKE_ALIGN"
  | "STROKE_WEIGHT"
  | "STROKE_STYLE"
  | "STROKE_DASH"
  | "STROKE_GAP"
  | "STROKE_CAP"
  | "STROKE_JOIN"
  | "STROKE_MITER_LIMIT";

type PropertyClipboardSupportedEffect =
  | "EFFECT_ALL"
  | "EFFECT_INNER_SHADOW"
  | "EFFECT_DROP_SHADOW"
  | "EFFECT_LAYER_BLUR"
  | "EFFECT_BACKGROUND_BLUR"
  | "EFFECT_NOISE"
  | "EFFECT_TEXTURE"
  | "EFFECT_GLASS";

type PropertyClipboardSupportedTypography =
  | "FONT_NAME"
  | "FONT_SIZE"
  | "LINE_HEIGHT"
  | "LETTER_SPACING"
  | "ALIGNMENT"
