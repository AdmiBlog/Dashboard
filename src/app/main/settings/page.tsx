"use client";
import { useState } from "react";
import { useRef,useContext } from "react";
import { getSettings, updateSettings,defaultSettings,SettingsContext } from "@/utils/settings";     
import type { Settings } from "@/utils/settings";
import {  Label, Input, Button ,Select} from "@fluentui/react-components";
import { config } from "@/config";
export default function SettingsPage(){
    const {settings,setSettings,handleColorModeChange}=useContext(SettingsContext);
    return (
        <>
            <h1>设置</h1>
            <div>
                <div>
                    <Label>颜色模式:</Label>
                    <Select value={settings.colorMode} onChange={(e)=>{
                        console.log(e.target.value,settings.colorMode);
                        setSettings({...settings,colorMode:e.target.value as "light"|"dark"|"system"});
                        handleColorModeChange(e.target.value as "light"|"dark"|"system");
                        updateSettings({...settings,colorMode:e.target.value as "light"|"dark"|"system"});
                    }}>
                        <option value="light">浅色</option>
                        <option value="dark">深色</option>
                        <option value="system">跟随系统</option>
                    </Select>
                </div>
            </div>
        </>
    );
}
