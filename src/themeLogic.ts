// Pure theme logic: no DOM code here, so it can be tested with Vitest.

// The navy color the app uses when no other color is chosen
export const DEFAULT_THEME_COLOR = '#1f3a68';

// A valid hex color is a # followed by exactly 6 characters from 0-9 and a-f, like #1f3a68
export const isValidHexColor = (color: string): boolean => {
  return /^#[0-9a-fA-F]{6}$/.test(color);
};

// Returns the saved theme color, or the default color if nothing (valid) is saved.
// localStorage.getItem returns string | null, so the parameter has the same union type.
export const getThemeColor = (saved: string | null): string => {
  if (saved !== null && isValidHexColor(saved)) {
    return saved;
  }
  return DEFAULT_THEME_COLOR;
};
