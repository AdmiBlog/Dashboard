import { config } from "@/config";
import { NavLinkGroup, NavLink } from "@/interfaces/nav";

function getHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

export async function refreshNavCache(){
    try{await fetch(`${config.blogUrl}/refreshCache/navs`);}
    catch(e){}
}

export async function getNav(): Promise<NavLinkGroup[]> {
  try {
    const res = await fetch(`${config.backEndUrl}/get/nav/navs`);
    if (!res.ok) return [];
    const data = await res.json();
    refreshNavCache();
    return data.data;
  } catch (e) {
    return [];
  }
}

// 新增分组
export async function addGroup(name: string, description = "",order = 0): Promise<boolean> {
  try {
    const res = await fetch(`${config.backEndUrl}/update/nav/addGroup`, {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify({ name, description,order }),
    });
    refreshNavCache();
    return res.ok;
  } catch {
    return false;
  }
}

// 删除分组
export async function deleteGroup(name: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${config.backEndUrl}/update/nav/deleteGroup?name=${encodeURIComponent(name)}`,
      {
        method: "DELETE",
        headers: getHeader(),
      }
    );
    refreshNavCache();
    return res.ok;
  } catch {
    return false;
  }
}

// 更新分组
export async function updateGroup(old_name: string, name: string, description = "", order = 0): Promise<boolean> {
  try {
    const res = await fetch(`${config.backEndUrl}/update/nav/updateGroup`, {
      method: "PUT",
      headers: getHeader(),
      body: JSON.stringify({ old_name, name, description,order }),
    });
    refreshNavCache();
    return res.ok;
  } catch {
    return false;
  }
}

// 添加友链
export async function addNav(
  group: string,
  nav: Omit<NavLink, "id"> & { id: string }
): Promise<boolean> {
  try {
    const res = await fetch(`${config.backEndUrl}/update/nav/addNav`, {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify({ ...nav, group }),
    });
    refreshNavCache();
    return res.ok;
  } catch {
    return false;
  }
}

// 更新友链
export async function updateNav(
  group: string,
  nav: NavLink
): Promise<boolean> {
  try {
    const res = await fetch(`${config.backEndUrl}/update/nav/updateNav`, {
      method: "PUT",
      headers: getHeader(),
      body: JSON.stringify({ ...nav, group }),
    });
    refreshNavCache();
    return res.ok;
  } catch {
    return false;
  }
}

// 删除友链
export async function deleteNav(group: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${config.backEndUrl}/update/nav/deleteNav?group=${encodeURIComponent(group)}&id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getHeader(),
      }
    );
    refreshNavCache();
    return res.ok;
  } catch {
    return false;
  }
}

// 移动友链到其他分组
export async function moveNavGroup(from_group: string, to_group: string, link_id: string): Promise<boolean> {
  try {
    const res = await fetch(`${config.backEndUrl}/update/nav/moveNavGroup`, {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify({ from_group, to_group, link_id }),
    });
    refreshNavCache();
    return res.ok;
  } catch {
    return false;
  }
}

export async function dispatchCheckLatencyWorkflow(): Promise<boolean> {
  try {
    const res = await fetch(`${config.backEndUrl}/update/nav/dispatchCheckLatencyWorkflow`);
    return res.ok;
  } catch {
    return false;
  }
}