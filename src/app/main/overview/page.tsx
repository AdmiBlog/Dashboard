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
  DualScreenUpdate20Regular
} from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";
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
