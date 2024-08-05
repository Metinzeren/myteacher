import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const SIZES = {
  fontLg: 16,
  font: 14,
  fontSm: 13,
  fontXs: 12,

  //radius
  radius_sm: 8,
  radius: 12,
  radius_md: 18,
  radius_lg: 30,

  //space
  padding: 15,
  margin: 15,

  //Font Sizes
  h1: 40,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,

  //App dimensions
  width,
  height,
};
export const FONTSIZES = {
  default: 14,
  hGiant: 60,
  h1: 40,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body1: 30,
  body2: 24,
  body3: 20,
  body4: 16,
  body5: 14,
  body6: 12,
  caption: 10,
  caption2: 8,
  description: 12,
  description2: 10,
  description3: 8,
};
export const FONTWEIGHT = {
  bold: 'bold',
  normal: 'normal',
  light: 'light',
  thin: '100',
};
export const COLORS = {
  primaryText: '#34495e',
  textBlack: '#000',
  textLink: '#008B8B',
  grey: 'grey',
  error: '#ff0000',
  white: '#fff',
  black: '#000',
  primary: '#4CAF50',
  secondary: '#f1c40f',
  tertiary: '#2c3e50',
  dark: '#000',
  light: '#fff',
  grey2: '#f9f9f9',
  grey3: '#f0f0f0',
  grey4: '#ebebeb',
  grey5: '#d8d8d8',
  descriptionColor: '#797979',
  darkBrown: '#3E2723',
  darkBlue: "#003366",
  darkPurple: '#4B0082',
  lightPurple: '#9370DB',
  lightGreen: '#32CD32',
  lightRed: '#FF6347',
  lightYellow: '#FFD700',
  lightBlue: '#87CEEB',
  lightOrange: '#FFA500',
  darkOrange: '#FF8C00',
  darkRed: '#8B0000',
  darkGreen: '#006400',
  darkYellow: '#B8860B',
  darkPink: '#FF1493',
  darkCyan: '#008B8B',
  darkMagenta: '#8B008B',
  darkGold: '#B8860B',
  darkViolet: '#9400D3',
  darkIndigo: '#4B0082',
  darkTurquoise: '#40E0D0',
  darkOlive: '#556B2F',
  darkSlate: '#2F4F4F',
};
