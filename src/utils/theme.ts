import { createDarkTheme, createLightTheme } from '@fluentui/react-components';
import type { BrandVariants, Theme } from '@fluentui/react-components';
import { config } from '@/config';
const myTheme: BrandVariants =  config.colorTheme;
export const lightTheme:Theme={
  ...createLightTheme(myTheme),
  // fontWeightRegular:600,
  fontFamilyBase:"Noto Sans SC",
  // fontWeightSemibold:800,
  // fontWeightMedium:700,
  // fontWeightBold:900,
};

export const darkTheme:Theme={
  ...createDarkTheme(myTheme),
  // fontWeightRegular:600,
  fontFamilyBase:"Noto Sans SC",
  // fontWeightSemibold:800,
  // fontWeightMedium:700,
  // fontWeightBold:900
};