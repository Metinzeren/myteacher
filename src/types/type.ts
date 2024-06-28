import {COLORS, FONTSIZES, FONTWEIGHT} from '../constant/theme';

export type SvgType = {
  height?: number;
  width?: number;
  fill?: string;
};
const colorKeys = Object.keys(COLORS) as (keyof typeof COLORS)[];
export type ColorType = (typeof colorKeys)[number];

const fontKeys = Object.keys(FONTSIZES) as (keyof typeof FONTSIZES)[];
export type FontSizeType = (typeof fontKeys)[number];

const fontWeightKeys = Object.keys(FONTWEIGHT) as (keyof typeof FONTWEIGHT)[];
export type FontWeightType = (typeof fontWeightKeys)[number];
