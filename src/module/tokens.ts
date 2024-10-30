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
      b: 225 / 255,
    },
    400: {
      r: 148 / 255,
      g: 164 / 255,
      b: 184 / 255,
    },
    500: {
      r: 100 / 255,
      g: 116 / 255,
      b: 139 / 255,
    },
    600: {
      r: 71 / 255,
      g: 85 / 255,
      b: 105 / 255,
    },
    700: {
      r: 51 / 255,
      g: 65 / 255,
      b: 85 / 255,
    },
    800: {
      r: 30 / 255,
      g: 41 / 255,
      b: 59 / 255,
    },
    900: {
      r: 15 / 255,
      g: 23 / 255,
      b: 42 / 255,
    },
    950: {
      r: 2 / 255,
      g: 6 / 255,
      b: 23 / 255,
    },
  },
  gray: {
    50: {
      r: 249 / 255,
      g: 250 / 255,
      b: 251 / 255,
    },
    100: {
      r: 243 / 255,
      g: 244 / 255,
      b: 246 / 255,
    },
    200: {
      r: 229 / 255,
      g: 231 / 255,
      b: 235 / 255,
    },
    300: {
      r: 209 / 255,
      g: 213 / 255,
      b: 219 / 255,
    },
    400: {
      r: 156 / 255,
      g: 163 / 255,
      b: 175 / 255,
    },
    500: {
      r: 107 / 255,
      g: 114 / 255,
      b: 128 / 255,
    },
    600: {
      r: 75 / 255,
      g: 85 / 255,
      b: 99 / 255,
    },
    700: {
      r: 55 / 255,
      g: 65 / 255,
      b: 81 / 255,
    },
    800: {
      r: 31 / 255,
      g: 41 / 255,
      b: 55 / 255,
    },
    900: {
      r: 17 / 255,
      g: 24 / 255,
      b: 39 / 255,
    },
    950: {
      r: 3 / 255,
      g: 7 / 255,
      b: 18 / 255,
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
  },
  text: {
    primary: primitiveTokens.slate[950],
    secondary: primitiveTokens.slate[500],
    tertiary: primitiveTokens.slate[400],
  },
  dividerColor: primitiveTokens.slate[200],
  strokeColor: primitiveTokens.slate[400],

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
  },
};
