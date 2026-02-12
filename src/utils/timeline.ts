import { config } from "@/config";
import { BB, updateBB } from "@/interfaces/bb";

export async function refreshTimelinesCache(){
    try{await fetch(`${config.blogUrl}/refreshCache/timeline`);}
    catch(e){}
}
export async function getTimelines(startl=0,endl:null|number=null):Promise<BB[]|null>{
    try{
        const res=await fetch(`${config.backEndUrl}/get/timeline/timeline?startl=${startl}&endl=${endl}`);
        console.log(res);
        if(res.ok){
            return (await res.json()).data;
        }
    }
    catch(e){}
    return null;
}
export async function getTimelineCount():Promise<number>{
    try{
        const res=await fetch(`${config.backEndUrl}/get/timeline/timelineCount`);
        if(res.ok){
            return (await res.json()).count;
        }
    }
    catch(e){}
    return 0;
}
export async function removeTimelines(time:number):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/timeline/deleteTimeline`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({time})
        });
        if(res.ok){
            refreshTimelinesCache();
            return true;
        }
    }
    catch(e){}
    return false;
}
export async function updateTimelines(timeline:updateBB):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/timeline/updateTimeline`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify(timeline)
        });
        if(res.ok){
            refreshTimelinesCache();
            return true;
        }
    }
    catch(e){}
    return false;
}
export async function addTimelines(timeline:BB):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/timeline/newTimeline`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify(timeline)
        });
        if(res.ok){
            refreshTimelinesCache();
            return true;
        }
    }
    catch(e){}
    return false;
}