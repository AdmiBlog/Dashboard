"use client";
import { config } from "@/config";
import { useEffect, useState, useRef } from "react";
import "@/styles/about.scss";
import { exitLogin } from "@/utils/access";
import { BaseDialog,BaseDialogProps } from "@/components/Dialog";
import { useRouter } from "nextjs-toploader/app";
import Messages, { MessagesRef } from "@/components/Messages";
import { Button } from "@fluentui/react-components";
import Vditor from "@/components/Vditor";
import {
  updateAbout,
} from "@/utils/miscs"
export default function About(){
  const [aboutContent,setAboutContent]=useState<string>("加载中...");
  const abouEditRef = useRef<{ getMarkdown: () => string }>(null);
  const [abouSaving,setAbouSaving] =useState<boolean>(false);
  const abouButtonRef = useRef<HTMLButtonElement>(null);
  const messageBarRef=useRef<MessagesRef>(null);
  useEffect(()=>{(async ()=>{
    fetch(`${config.backEndUrl}/get/miscs/about`)
    .then(async res=>{
        if(res.ok)
        setAboutContent((await res.json()).data);
    })
  })()},[]);
  return (
    <>
      <Messages ref={messageBarRef}/>
      <h1>编辑关于页</h1>
      <div className="misc-edit-main" >
        <Vditor content={aboutContent} ref={abouEditRef} />
      </div>
      <div className="misc-edit-button-save">
        <Button 
          appearance="primary"
          ref={abouButtonRef}
          disabled={abouSaving}
          onClick={async ()=>{
            setAbouSaving(true);
            if( await updateAbout(abouEditRef.current?.getMarkdown()!)){
              messageBarRef.current?.addMessage(
                "提示",
                "保存成功",
                "success"
              );
            }else{
              messageBarRef.current?.addMessage("提示", "保存失败", "error");
            }
            setAbouSaving(false);
          }}
        >
          {abouSaving ? "保存中..." : "保存"}
        </Button>
      </div>
    </>
  );
}