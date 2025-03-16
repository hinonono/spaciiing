export type PropertyClipboardSupportedProperty =
  | "WIDTH"
  | "HEIGHT"
  | "LAYER_OPACITY"
  | "LAYER_CORNER_RADIUS"
  | "LAYER_BLEND_MODE"
  | PropertyClipboardSupportedFill
  | PropertyClipboardSupportedStroke
  | PropertyClipboardSupportedEffect
  | "EXPORT_SETTINGS";

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
  | "EFFECT_BACKGROUND_BLUR";
