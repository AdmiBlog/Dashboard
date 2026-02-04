import { config } from "@/config";
import { pushUpdateTime } from "./siteinfo";
import { Post } from "@/interfaces/post";
import moment from "moment";

function getHeader(){
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+localStorage.getItem('token')
    };
}

export async function refreshMiscsCache(){
    try{await fetch(`${config.blogUrl}/refreshCache/miscs`);}
    catch(e){}
}

export async function updateAnnouncement(content: string):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/miscs/announcement`, {
            method: 'PUT',
            headers:getHeader(),
            body: JSON.stringify({
                content:content
            })
        });
        refreshMiscsCache();
        if(res.ok) return true;
        else return false;
    }
    catch(err){
        return false;
    }
}

export async function updateCommentProtocol(content: string):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/miscs/commentProtocol`, {
            method: 'PUT',
            headers:getHeader(),
            body: JSON.stringify({
                content:content
            })
        });
        refreshMiscsCache();
        if(res.ok) return true;
        else return false;
    }
    catch(err){
        return false;
    }
}

export async function updatePrivacy(content: string):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/miscs/privacy`, {
            method: 'PUT',
            headers:getHeader(),
            body: JSON.stringify({
                content:content
            })
        });
        refreshMiscsCache();
        if(res.ok) return true;
        else return false;
    }
    catch(err){
        return false;
    }
}

export async function updateLicense(content: string):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/miscs/license`, {
            method: 'PUT',
            headers:getHeader(),
            body: JSON.stringify({
                content:content
            })
        });
        refreshMiscsCache();
        if(res.ok) return true;
        else return false;
    }
    catch(err){
        return false;
    }
}

export async function updateAbout(content: string):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/miscs/about`, {
            method: 'PUT',
            headers:getHeader(),
            body: JSON.stringify({
                content:content
            })
        });
        refreshMiscsCache();
        if(res.ok) return true;
        else return false;
    }
    catch(err){
        return false;
    }
}
export async function updateFlinkAnno(content: string):Promise<boolean>{
    try{
        const res=await fetch(`${config.backEndUrl}/update/miscs/flinkAnno`, {
            method: 'PUT',
            headers:getHeader(),
            body: JSON.stringify({
                content:content
            })
        });
        refreshMiscsCache();
        if(res.ok) return true;
        else return false;
    }
    catch(err){
        return false;
    }
}