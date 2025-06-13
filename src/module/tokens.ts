const primitiveTokens = {
  slate: {
    50: {
      r: 248 / 255,
      g: 250 / 255,
      b: 252 / 255,
    },
    100: {
      r: 241 / 255,
      g: 245 / 255,
      b: 249 / 255,
    },
    200: {
      r: 226 / 255,
      g: 232 / 255,
      b: 240 / 255,
    },
    300: {
      r: 203 / 255,
      g: 213 / 255,
      b: 226 / 255,
    },
    400: {
      r: 144 / 255,
      g: 161 / 255,
      b: 185 / 255,
    },
    500: {
      r: 98 / 255,
      g: 116 / 255,
      b: 142 / 255,
    },
    600: {
      r: 69 / 255,
      g: 85 / 255,
      b: 108 / 255,
    },
    700: {
      r: 49 / 255,
      g: 65 / 255,
      b: 88 / 255,
    },
    800: {
      r: 29 / 255,
      g: 41 / 255,
      b: 61 / 255,
    },
    900: {
      r: 15 / 255,
      g: 23 / 255,
      b: 43 / 255,
    },
    950: {
      r: 2 / 255,
      g: 6 / 255,
      b: 24 / 255,
    },
  },
  white: {
    r: 1,
    g: 1,
    b: 1,
  },
};

export const semanticTokens = {
  background: {
    primary: primitiveTokens.white,
    secondary: primitiveTokens.slate[50],
    tertiary: primitiveTokens.slate[200],
  },
  text: {
    primary: primitiveTokens.slate[950],
    secondary: primitiveTokens.slate[500],
    tertiary: primitiveTokens.slate[400],
  },
  dividerColor: primitiveTokens.slate[200],
  strokeColor: primitiveTokens.slate[300],
  fontSize: {
    xsmall: 8,
    small: 12,
    base: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,
  },
  padding: {
    xxsmall: 4,
    xsmall: 8,
    small: 12,
    base: 16,
    large: 24,
    xlarge: 32,
  },
  spacing: {
    xxsmall: 4,
    xsmall: 8,
    small: 12,
    base: 16,
    large: 24,
    xlarge: 32,
  },
  cornerRadius: {
    xxsmall: 4,
    xsmall: 8,
    small: 12,
    base: 16,
    large: 24,
    xlarge: 32,
    infinite: 999,
  },
};
