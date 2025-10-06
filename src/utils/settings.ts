import { createContext } from "react";
export declare interface Settings{
    colorMode:"light" | "dark" | "system"
}
export const defaultSettings:Settings={
    colorMode:"light"
};
export async function getSettings():Promise<Settings>{
    try{
        //从localStorage获取设置
        const settings = localStorage.getItem('settings');
        return settings ? JSON.parse(settings) : defaultSettings;
    }catch(error){
        console.error('Error getting settings:', error);
        return defaultSettings;
    }
}
export async function updateSettings(newSettings:Settings):Promise<boolean>{
    try{
        //更新localStorage中的设置
        localStorage.setItem('settings', JSON.stringify(newSettings));
        return true;
    }catch(error){
        console.error('Error updating settings:', error);
        return false;
    }
}
export const SettingsContext = createContext({
  settings: defaultSettings,
  setSettings: (settings: Settings) => {},
  handleColorModeChange: (colorMode: "light" | "dark" | "system") => {}
});