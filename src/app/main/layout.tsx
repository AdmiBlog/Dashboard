"use client";
import { 
  ReactElement,
  useEffect,
  useRef,
  useState,
  ReactNode,
  RefObject,
} from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import Messages, { MessagesRef } from "@/components/Messages";
import verifyToken, { exitLogin } from "@/utils/access";
import {
  TabList,
  OverflowItem,
  Tab
} from "@fluentui/react-components"
import { 
  ArchiveRegular,
  LinkRegular,
  DocumentRegular,
  CommentRegular,
  HeadphonesSoundWaveRegular,
  ImageRegular,
  SettingsRegular,
  ChartMultipleRegular,
  ChatRegular,
  CollectionsEmptyRegular,
  LayoutRowTwoSplitTopFocusTopLeftFilled,
  TimelineRegular,
} from "@fluentui/react-icons";
import NoSSR from "@/components/NoSSR";
import "@/styles/admin.scss";

import React from "react";

declare interface TabItem{
  name:string;
  link:string;
  icon:ReactElement;
}
const tabs:TabItem[]=[
  {
    name: "博客概览",
    link: "/main/overview",
    icon: <ChartMultipleRegular/>
  },
  {
    name: "文章管理",
    link: "/main/posts",
    icon: <DocumentRegular/>
  },
  {
    name: "草稿箱",
    link: "/main/drafts",
    icon: <ArchiveRegular/>
  },
  {
    name: "说说管理",
    link: "/main/speaks",
    icon: <ChatRegular/>
  },
  {
    name: "最近评论",
    link: "/main/comments",
    icon: <CommentRegular/>
  },
  {
    name: "友链管理",
    link: "/main/flinks",
    icon: <LinkRegular/>
  },
  {
    name: "图床",
    link: "/main/images",
    icon: <ImageRegular/>
  },
  {
    name: "网址收藏",
    link: "/main/nav",
    icon: <CollectionsEmptyRegular/>
  },
  {
    name: "音乐管理",
    link: "/main/music",
    icon: <HeadphonesSoundWaveRegular/>
  },
  {
    name: "左上角",
    link: "/main/topleft",
    icon: <LayoutRowTwoSplitTopFocusTopLeftFilled/>
  },
  {
    name: "时间线",
    link: "/main/timeline",
    icon: <TimelineRegular/>
  },
  {
    name: "设置",
    link: "/main/settings",
    icon: <SettingsRegular/>
  }
]
export default function Page({
  children,
}: Readonly<{
  children: ReactNode;
}>){
  const router=useRouter();
  const path=usePathname();
  const messageBarRef=useRef<MessagesRef>(null);
  const [selectedTabLink,setSelectedTabLink]=useState<string>(`/main/${path.split("/")[2]}`);
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      messageBarRef.current?.addMessage(
        "错误","请先登录","error"
      );
      setTimeout(()=>{
        router.push("/login");
      },1000);
    }
    else{
      verifyToken(localStorage.getItem("token"))
        .then(async res=>{
          if(!res){
            messageBarRef.current?.addMessage(
              "错误","登录失效，请重新登录","error"
            );
            setTimeout(()=>{
              router.push("/login");
            },1000);
          }
        })
    }
  },[]);
  useEffect(()=>{
    setSelectedTabLink(`/main/${path.split("/")[2]}`);
  },[path]);
  const onTabSelect=(tabLink:string)=>{
    setSelectedTabLink(tabLink);
  };
  return (
    <>
      <Messages ref={messageBarRef}/>
      <NoSSR>
        <div id="admin">
          <div id="admin-leftbar">
            <TabList
              vertical
              selectedValue={selectedTabLink}
              onTabSelect={(_,d)=>onTabSelect(d.value as string)}
              appearance="subtle"
              size="large"
            >
            {tabs.map((tab) => {
              return (
                <OverflowItem
                  key={tab.name}
                  id={tab.name}
                  priority={tab.link===selectedTabLink?2:1}
                >
                  <Tab onClick={
                      ()=>{
                        setTimeout(()=>router.push(tab.link),100);
                      }
                    } 
                    value={tab.link} 
                    icon={<span>{tab.icon}</span>}
                  >
                    {tab.name}
                  </Tab>
                </OverflowItem>
              );
            })}
            </TabList>
          </div>
          <div id="admin-container">
            {children}
          </div>
        </div>
      </NoSSR>
    </>
  )
}
