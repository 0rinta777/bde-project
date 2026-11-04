import { describe, it, expect } from 'vitest';
import { isValidHexColor, getThemeColor, DEFAULT_THEME_COLOR } from './themeLogic';

describe('isValidHexColor', () => {
  // a normal 6-character hex color is valid
  it('returns true for a valid hex color', () => {
    expect(isValidHexColor('#1f3a68')).toBe(true);
  });

  // capital letters are allowed too
  it('accepts capital letters', () => {
    expect(isValidHexColor('#FF00AA')).toBe(true);
  });

  // a color name is not a hex color
  it('returns false for a color name', () => {
    expect(isValidHexColor('blue')).toBe(false);
  });

  // too short, missing # or letters after f are not valid
  it('returns false for wrong formats', () => {
    expect(isValidHexColor('#123')).toBe(false);
    expect(isValidHexColor('1f3a68')).toBe(false);
    expect(isValidHexColor('#zzzzzz')).toBe(false);
  });
});

describe('getThemeColor', () => {
  // nothing saved yet (localStorage.getItem returns null)
  it('returns the default navy color when nothing is saved', () => {
    expect(getThemeColor(null)).toBe(DEFAULT_THEME_COLOR);
  });

  // a valid saved color is used
  it('returns the saved color when it is valid', () => {
    expect(getThemeColor('#cc0066')).toBe('#cc0066');
  });

  // broken saved data should not break the theme
  it('returns the default color when the saved color is not valid', () => {
    expect(getThemeColor('not a color')).toBe(DEFAULT_THEME_COLOR);
  });
});
