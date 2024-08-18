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

export function isVariableAliasType(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as VariableAlias).type === "VARIABLE_ALIAS" &&
    typeof (value as VariableAlias).id === "string"
  );
}
