import type { BrandVariants, Theme } from '@fluentui/react-components';
declare interface Config{
    title: string,
    backEndUrl: string,
    blogUrl: string,
    falldownAvatar: string,
    colorTheme: BrandVariants,
}
export const config:Config={
    title: "Admibrill的博客",
    backEndUrl: "https://blogend.qyadbr.top",
    blogUrl: "https://blog.qyadbr.top",
    falldownAvatar: "https://img.0v0.my/2024/09/06/66dabf7f748c8.jpg",
    colorTheme:{ 
      10: "#020305",
      20: "#111723",
      30: "#16263D",
      40: "#193253",
      50: "#1B3F6A",
      60: "#1B4C82",
      70: "#18599B",
      80: "#1267B4",
      90: "#3174C2",
      100: "#4F82C8",
      110: "#6790CF",
      120: "#7D9ED5",
      130: "#92ACDC",
      140: "#A6BAE2",
      150: "#BAC9E9",
      160: "#CDD8EF"
    }
}