"use client";
import { darkTheme, lightTheme } from "@/utils/theme";
import { FluentProvider } from '@fluentui/react-components';
import NextTopLoader from 'nextjs-toploader';
import { useState,useEffect } from 'react';
import { defaultSettings,getSettings,SettingsContext } from "@/utils/settings";
import type { Settings } from "@/utils/settings";
import "@/styles/global.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentTheme,setCurrentTheme]=useState(lightTheme);
  const [settings,setSettings]=useState<Settings>(defaultSettings);
  const handleColorModeChange=(newColorMode: "light" | "dark" | "system")=>{
    if(newColorMode==="light"){
      setCurrentTheme(lightTheme);
    }
    else if(newColorMode==="dark"){
      setCurrentTheme(darkTheme);
    }
    else{
      if(window.matchMedia("(prefers-color-scheme: dark)").matches)
        setCurrentTheme(darkTheme);
      else
        setCurrentTheme(lightTheme);
    }
  };
  useEffect(() => {
    getSettings().then((fetchedSettings) => {
      setSettings(fetchedSettings);
      handleColorModeChange(fetchedSettings.colorMode);
    });
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if(settings.colorMode==="system"){
      if(mediaQuery.matches)
        setCurrentTheme(darkTheme);
      else
        setCurrentTheme(lightTheme);
    }
    else if(settings.colorMode==="dark"){
      setCurrentTheme(darkTheme);
    }
    else{
      setCurrentTheme(lightTheme);
    }
    const handleChange=(e:MediaQueryListEvent)=>{
      if(settings.colorMode==="system"){
        if(e.matches)
          setCurrentTheme(darkTheme);
        else
          setCurrentTheme(lightTheme);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    // 清除监听器
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return (
    <html lang="zh-cn" data-theme={settings.colorMode==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):settings.colorMode}>
      <head>
        <title>AdmiBlog - Dashboard</title>
        <link href="https://fonts.googleapis.cn/css2?family=Noto+Sans+SC:wght@400..900&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.cn/css2?family=Noto+Serif+SC:wght@400..900&display=swap" rel="stylesheet"/>
      </head>
      <body >
        <NextTopLoader color="#2c4fb8ff" height={5}/>
        <div id="web-bg"/>
        <FluentProvider theme={currentTheme}>
          <SettingsContext.Provider value={{settings,setSettings,handleColorModeChange}}>
            {children}
          </SettingsContext.Provider>
        </FluentProvider>
      </body>
    </html>
  );
}
