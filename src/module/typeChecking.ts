export function isRGBAType(value: VariableValue): value is RGBA {
  return (
    typeof value === "object" &&
    value !== null &&
    "r" in value &&
    "g" in value &&
    "b" in value &&
    "a" in value
  );
}

export function isRGBType(value: VariableValue): value is RGB {
  return (
    typeof value === "object" &&
    value !== null &&
    "r" in value &&
    "g" in value &&
    "b" in value
  );
}

export function isVariableAliasType(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as VariableAlias).type === "VARIABLE_ALIAS" &&
    typeof (value as VariableAlias).id === "string"
  );
}

export function isFloatType(value: VariableValue): value is number {
  return typeof value === "number";
}

export function isStringType(value: VariableValue): value is string {
  return typeof value === "string";
}
