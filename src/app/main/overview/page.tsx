"use client";
import {config} from "@/config";
import { useEffect, useState, useRef } from "react";
import "@/styles/overview.scss";
import { exitLogin } from "@/utils/access";
import { BaseDialog,BaseDialogProps } from "@/components/Dialog";
import { useRouter } from "nextjs-toploader/app";
import Messages, { MessagesRef } from "@/components/Messages";
import { 
  Document24Regular, 
  Folder24Regular,
  Tag24Regular,
  Comment24Regular,
  CommentMultiple24Regular,
  Link24Regular,
  Archive24Regular,
  Chat24Regular,
  DualScreenUpdate20Regular,
  ArrowCollapseAllRegular,
  ArrowExpandAllRegular,
} from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";
import Vditor from "@/components/Vditor";
import {
  updateAnnouncement,
  updateCommentProtocol,
  updatePrivacy,
  updateLicense
} from "@/utils/miscs"
export default function Overview() {
    const router=useRouter();
    const messageBarRef=useRef<MessagesRef>(null);
    const [postCount,setPostCount]=useState<number>(-1);
    const [categoryCount,setCategoryCount]=useState<number>(-1);
    const [tagCount,setTagCount]=useState<number>(-1);
    const [speaksCount,setSpeaksCount]=useState<number>(-1);
    const [flinkCount,setFlinkCount]=useState<number>(-1);
    const [commentCount,setCommentCount]=useState<number>(-1);
    const [draftCount,setDraftCount]=useState<number>(-1);
    const [lastUpdate,setLastUpdate]=useState<number>(-1);
    const [dialogState,setDialogState]=useState<BaseDialogProps>({
        title:"",
        content:<></>,
        onConfirm:()=>{},
        onClose:()=>{},
        open:false,
      });
    const [announcementContent,setAnnouncementContent]=useState<string>("加载中...");
    const [commentProtocolContent,setCommentProtocolContent]=useState<string>("加载中...");
    const [privacyContent,setPrivacyContent]=useState<string>("加载中...");
    const [licenseContent,setLicenseContent]=useState<string>("加载中...");
    const annoEditRef = useRef<{ getMarkdown: () => string }>(null);
    const comptclEditRef = useRef<{ getMarkdown: () => string }>(null);
    const privacyEditRef = useRef<{ getMarkdown: () => string }>(null);
    const licenseEditRef = useRef<{ getMarkdown: () => string }>(null);
    const [annoEditOpen,setAnnoEditOpen] =useState<boolean>(false);
    const [commEditOpen,setCommEditOpen] =useState<boolean>(false);
    const [privEditOpen,setPrivEditOpen] =useState<boolean>(false);
    const [liceEditOpen,setLiceEditOpen] =useState<boolean>(false);
    const [annoSaving,setAnnoSaving] =useState<boolean>(false);
    const [commSaving,setCommSaving] =useState<boolean>(false);
    const [privSaving,setPrivSaving] =useState<boolean>(false);
    const [liceSaving,setLiceSaving] =useState<boolean>(false);
    const annoButtonRef = useRef<HTMLButtonElement>(null);
    const commButtonRef = useRef<HTMLButtonElement>(null);
    const privButtonRef = useRef<HTMLButtonElement>(null);
    const liceButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(()=>{(async ()=>{
        fetch(`${config.backEndUrl}/get/post/postCount`)
        .then(async res=>{
            if(res.ok){
            setPostCount((await res.json()).count);
            }
        });
        fetch(`${config.backEndUrl}/get/category/categoryCount`)
        .then(async res=>{
            if(res.ok){
            setCategoryCount((await res.json()).count);
            }
        })
        fetch(`${config.backEndUrl}/get/tag/tagCount`)
        .then(async res=>{
            if(res.ok){
            setTagCount((await res.json()).count);
            }
        })
        fetch(`${config.backEndUrl}/get/draft/draftCount`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
        .then(async res=>{
            if(res.ok){
            setDraftCount((await res.json()).count);
            }
        })
        fetch(`${config.backEndUrl}/get/speaks/speaksCount`)
        .then(async res=>{
            if(res.ok){
            setSpeaksCount((await res.json()).count);
            }
        })
        fetch(`${config.backEndUrl}/get/flink/flinkCount`)
        .then(async res=>{
            if(res.ok){
            setFlinkCount((await res.json()).count);
            }
        })
        fetch(`${config.backEndUrl}/get/siteInfo/lastUpdateTime`)
        .then(async res=>{
            if(res.ok)
            setLastUpdate((await res.json()).time);
        })
        fetch(`${config.backEndUrl}/get/miscs/announcement`)
        .then(async res=>{
            if(res.ok)
            setAnnouncementContent((await res.json()).data);
        })
        fetch(`${config.backEndUrl}/get/miscs/commentProtocol`)
        .then(async res=>{
            if(res.ok)
            setCommentProtocolContent((await res.json()).data);
        })
        fetch(`${config.backEndUrl}/get/miscs/privacy`)
        .then(async res=>{
            if(res.ok)
            setPrivacyContent((await res.json()).data);
        })
        fetch(`${config.backEndUrl}/get/miscs/license`)
        .then(async res=>{
            if(res.ok)
            setLicenseContent((await res.json()).data);
        })
    })()},[]);
    return (
    <>
      <Messages ref={messageBarRef}/>
      <h1>总览-Admibrill的博客</h1>
      
      <div id="overview-counts">
        <div className="overview-count posts">
          <Document24Regular className="overview-count-icon"/>
          <span className="overview-count-title">文章</span>
          <span className="overview-count-value">{postCount==-1?"...":postCount}</span>
        </div>
        <div className="overview-count categories">
          <Folder24Regular className="overview-count-icon"/>
          <span className="overview-count-title">分类</span>
          <span className="overview-count-value">{categoryCount==-1?"...":categoryCount}</span>
        </div>
        <div className="overview-count tags">
          <Tag24Regular className="overview-count-icon"/>
          <span className="overview-count-title">标签</span>
          <span className="overview-count-value">{tagCount==-1?"...":tagCount}</span>
        </div>
        <div className="overview-count drafts">
          <Archive24Regular className="overview-count-icon"/>
          <span className="overview-count-title">草稿</span>
          <span className="overview-count-value">{draftCount==-1?"...":draftCount}</span>
        </div>
        <div className="overview-count speaks">
          <Chat24Regular className="overview-count-icon"/>
          <span className="overview-count-title">哔哔</span>
          <span className="overview-count-value">{speaksCount==-1?"...":speaksCount}</span>
        </div>
        <div className="overview-count comments">
          <Comment24Regular className="overview-count-icon"/>
          <span className="overview-count-title">评论</span>
          <span className="overview-count-value">{commentCount==-1?"...":commentCount}</span>
        </div> 
        <div className="overview-count flinks">
          <Link24Regular className="overview-count-icon"/>
          <span className="overview-count-title">友链</span>
          <span className="overview-count-value">{flinkCount==-1?"...":flinkCount}</span>
        </div>
        <div className="overview-count flinks">
          <DualScreenUpdate20Regular className="overview-count-icon"/>
          <span className="overview-count-title">上次更新</span>
          <span className="overview-count-value">{lastUpdate==-1?"...":lastUpdate}</span>
        </div> 
      </div>

      <div>
        <Button id="logout-button" onClick={()=>{
          setDialogState({
            title:"注销",
            content:<>确定要退出登录吗？</>,
            open:true,
            onConfirm:()=>{
              setDialogState({
                ...dialogState,
                open:false
              });
              exitLogin();
              messageBarRef.current?.addMessage("提示","已注销","info");
              setTimeout(()=>router.push("/login"),1000);
            },
            onClose:()=>{
              setDialogState({
                ...dialogState,
                open:false
              });
            }
          });
        }
        }>
        退出登录
        </Button>
      </div>
      <div className="misc-edit-bar">
        <div className="misc-edit-bar-title">
          <h2>编辑首页公告</h2>
        </div>
        <div className="misc-edit-bar-button">
          <Button icon={annoEditOpen ? <ArrowCollapseAllRegular/> : <ArrowExpandAllRegular/>} 
            onClick={()=>{
              if(annoEditOpen){
                setAnnoEditOpen(false);
              }
              else{
                setAnnoEditOpen(true);
                setCommEditOpen(false);
                setPrivEditOpen(false);
                setLiceEditOpen(false);
              }
            }}
          >
            {annoEditOpen ? "折叠" : "展开"}
          </Button>
        </div>
      </div>
      <div className="misc-edit-main" >
        {annoEditOpen ? 
            <Vditor content={announcementContent} ref={annoEditRef} />
          : <></>
        }
      </div>
      <div className="misc-edit-button-save">
        {annoEditOpen ? 
          <Button 
            appearance="primary"
            ref={annoButtonRef}
            disabled={annoSaving}
            onClick={async ()=>{
              setAnnoSaving(true);
              if( await updateAnnouncement(annoEditRef.current?.getMarkdown()!)){
                messageBarRef.current?.addMessage(
                  "提示",
                  "保存成功",
                  "success"
                );
              }else{
                messageBarRef.current?.addMessage("提示", "保存失败", "error");
              }
              setAnnoSaving(false);
            }}
          >
            {annoSaving ? "保存中..." : "保存"}
          </Button>
          : <></>
        }
      </div>
      <div className="misc-edit-bar">
        <div className="misc-edit-bar-title">
          <h2>编辑评论协议</h2>
        </div>
        <div className="misc-edit-bar-button">
          <Button icon={commEditOpen ? <ArrowCollapseAllRegular/> : <ArrowExpandAllRegular/>} 
            onClick={()=>{
              if(commEditOpen){
                setCommEditOpen(false);
              }
              else{
                setAnnoEditOpen(false);
                setCommEditOpen(true);
                setPrivEditOpen(false);
                setLiceEditOpen(false);
              }
            }}
          >
            {commEditOpen ? "折叠" : "展开"}
          </Button>
        </div>
      </div>
      <div className="misc-edit-main" >
        {commEditOpen ? 
          <Vditor content={commentProtocolContent} ref={comptclEditRef} />
          : <></>
        }
      </div>
      <div className="misc-edit-button-save">
        {commEditOpen ? 
          <Button 
            appearance="primary"
            ref={commButtonRef}
            disabled={commSaving}
            onClick={async ()=>{
              setCommSaving(true);
              if( await updateCommentProtocol(comptclEditRef.current?.getMarkdown()!)){
                messageBarRef.current?.addMessage(
                  "提示",
                  "保存成功",
                  "success"
                );
              }else{
                messageBarRef.current?.addMessage("提示", "保存失败", "error");
              }
              setCommSaving(false);
            }}
          >
            {commSaving ? "保存中..." : "保存"}
          </Button>
          : <></>
        }
      </div>
      <div className="misc-edit-bar">
        <div className="misc-edit-bar-title">
          <h2>编辑隐私协议</h2>
        </div>
        <div className="misc-edit-bar-button">
          <Button icon={privEditOpen ? <ArrowCollapseAllRegular/> : <ArrowExpandAllRegular/>} 
            onClick={()=>{
              if(privEditOpen){
                setPrivEditOpen(false);
              }
              else{
                setAnnoEditOpen(false);
                setCommEditOpen(false);
                setPrivEditOpen(true);
                setLiceEditOpen(false);
              }
            }}
          >
            {privEditOpen ? "折叠" : "展开"}
          </Button>
        </div>
      </div>
      <div className="misc-edit-main">
        {privEditOpen ? 
          <Vditor content={privacyContent} ref={privacyEditRef} />
          : <></>
        }
      </div>
      <div className="misc-edit-button-save">
        {privEditOpen ? 
          <Button 
            appearance="primary"
            ref={privButtonRef}
            disabled={privSaving}
            onClick={async ()=>{
              setPrivSaving(true);
              if( await updatePrivacy(privacyEditRef.current?.getMarkdown()!)){
                messageBarRef.current?.addMessage(
                  "提示",
                  "保存成功",
                  "success"
                );
              }else{
                messageBarRef.current?.addMessage("提示", "保存失败", "error");
              }
              setPrivSaving(false);
            }}
          >
            {privSaving ? "保存中..." : "保存"}
          </Button>
          : <></>
        }
      </div>
      <div className="misc-edit-bar">
        <div className="misc-edit-bar-title">
          <h2>编辑声明</h2>
        </div>
        <div className="misc-edit-bar-button">
          <Button icon={liceEditOpen ? <ArrowCollapseAllRegular/> : <ArrowExpandAllRegular/>} 
            onClick={()=>{
              if(liceEditOpen){
                setLiceEditOpen(false);
              }
              else{
                setAnnoEditOpen(false);
                setCommEditOpen(false);
                setPrivEditOpen(false);
                setLiceEditOpen(true);
              }
            }}
          >
            {liceEditOpen ? "折叠" : "展开"}
          </Button>
        </div>
      </div>
      <div className="misc-edit-main">
        {liceEditOpen ? 
          <Vditor content={licenseContent} ref={licenseEditRef} />
          : <></>
        }
      </div>
      <div className="misc-edit-button-save">
        {liceEditOpen ? 
          <Button 
            appearance="primary"
            ref={liceButtonRef}
            disabled={liceSaving}
            onClick={async ()=>{
              setLiceSaving(true);
              if( await updateLicense(licenseEditRef.current?.getMarkdown()!)){
                messageBarRef.current?.addMessage(
                  "提示",
                  "保存成功",
                  "success"
                );
              }else{
                messageBarRef.current?.addMessage("提示", "保存失败", "error");
              }
              setLiceSaving(false);
            }}
          >
            {liceSaving ? "保存中..." : "保存"}
          </Button>
          : <></>
        }
      </div>
      <BaseDialog 
        content={dialogState.content} 
        open={dialogState.open} 
        title={dialogState.title} 
        onConfirm={dialogState.onConfirm}
        onClose={dialogState.onClose}
      />
    </>
  );
}
