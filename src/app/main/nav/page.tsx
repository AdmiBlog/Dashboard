"use client";
import { config } from "@/config";
import { NavLinkGroup } from "@/interfaces/nav";
import {
  getNav,
  addNav,
  deleteNav,
  addGroup,
  deleteGroup,
  updateGroup,
  updateNav,
  moveNavGroup,
  dispatchCheckLatencyWorkflow,
} from "@/utils/nav";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import LazyLoad from "vanilla-lazyload";
import {
  ArrowUploadFilled,
  Checkmark16Regular,
  Dismiss16Regular,
  EditFilled,
  ComposeRegular,
  OpenFilled,
  Color24Regular,
  DeleteRegular,
  ArrowLeftRegular,
  LinkEditRegular,
  AddRegular,
  ArrowClockwiseRegular,
} from "@fluentui/react-icons";
import {
  Input,
  Button,
  Label,
  Dropdown,
  Option,
  SpinButton,
} from "@fluentui/react-components";
import { BaseDialog } from "@/components/Dialog";
import Messages, { MessagesRef } from "@/components/Messages";
import "@/styles/nav.scss";
import stringRandom from "string-random";
import Vditor from "@/components/Vditor";
function isValidUrl(url: string) {
  return /^https?:\/\/.+/i.test(url);
}
export default function Nav() {
  const [nav, setNav] = useState<NavLinkGroup[]>([]);
  const [nameEditing, setNameEditing] = useState<{
    groupIdx: number;
    linkIdx: number;
  } | null>(null);
  const [nameEditValue, setNameEditValue] = useState("");
  const [colorEditing, setColorEditing] = useState<{
    groupIdx: number;
    linkIdx: number;
    color: string;
  } | null>(null);
  const [descrEditing, setDescrEditing] = useState<{
    groupIdx: number;
    linkIdx: number;
  } | null>(null);
  const [descrEditValue, setDescrEditValue] = useState("");
  const [avatarEditing, setAvatarEditing] = useState<{
    groupIdx: number;
    linkIdx: number;
    avatar: string;
  } | null>(null);
  const [avatarInput, setAvatarInput] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);
  const [groupEditing, setGroupEditing] = useState<{
    groupIdx: number;
    name: string;
    description: string;
    order?: number;
  } | null>(null);
  const [deleteGroupIdx, setDeleteGroupIdx] = useState<number | null>(null);
  const [deleteLinkInfo, setDeleteLinkInfo] = useState<{
    groupIdx: number;
    linkIdx: number;
  } | null>(null);
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newOrder, setNewOrder] = useState(0);
  const [moveLinkInfo, setMoveLinkInfo] = useState<{
    groupIdx: number;
    linkIdx: number;
  } | null>(null);
  const [moveTargetGroup, setMoveTargetGroup] = useState<number | null>(null);
  const [editing, setEditing] = useState<number>(0);
  const messageBarRef = useRef<MessagesRef>(null);
  const [urlEditing, setUrlEditing] = useState<{
    groupIdx: number;
    linkIdx: number;
  } | null>(null);
  const [urlEditValue, setUrlEditValue] = useState("");
  useEffect(() => {
    (async () => {
      // 拉取后排序
      const groups = await getNav();
      setNav(groups.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    })();
  }, []);
  useEffect(() => {
    const lazyLoadInstance = new LazyLoad({ elements_selector: ".lazy-img" });
    lazyLoadInstance.update();
  }, [
    nav,
    editing,
    nameEditing,
    colorEditing,
    descrEditing,
    avatarEditing,
    urlEditing,
  ]);
  const handleEdit = (groupIdx: number, linkIdx: number, name: string) => {
    setNameEditing({ groupIdx, linkIdx });
    setNameEditValue(name);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameEditValue(e.target.value);
  };

  const handleEditConfirm = async () => {
    if (nameEditing) {
      const group = nav[nameEditing.groupIdx];
      const link = group.links[nameEditing.linkIdx];
      const updated = { ...link, name: nameEditValue };
      const ok = await updateNav(group.name, updated);
      if (ok) {
        setNav((prev) =>
          prev.map((g, gi) =>
            gi === nameEditing.groupIdx
              ? {
                  ...g,
                  links: g.links.map((l, li) =>
                    li === nameEditing.linkIdx ? updated : l
                  ),
                }
              : g
          )
        );
        messageBarRef.current?.addMessage("提示", "修改成功", "success");
      } else {
        messageBarRef.current?.addMessage("错误", "修改失败", "error");
      }
      setNameEditing(null);
      setEditing(Math.random());
    }
  };

  const handleEditCancel = () => {
    setNameEditing(null);
    setNameEditValue("");
    setEditing(Math.random());
  };

  const handleDescrEdit = (
    groupIdx: number,
    linkIdx: number,
    descr: string
  ) => {
    setDescrEditing({ groupIdx, linkIdx });
    setDescrEditValue(descr);
  };

  const handleDescrEditConfirm = async () => {
    if (descrEditing) {
      const group = nav[descrEditing.groupIdx];
      const link = group.links[descrEditing.linkIdx];
      const updated = { ...link, description: descrEditValue };
      const ok = await updateNav(group.name, updated);
      if (ok) {
        setNav((prev) =>
          prev.map((g, gi) =>
            gi === descrEditing.groupIdx
              ? {
                  ...g,
                  links: g.links.map((l, li) =>
                    li === descrEditing.linkIdx ? updated : l
                  ),
                }
              : g
          )
        );
        messageBarRef.current?.addMessage("提示", "描述修改成功", "success");
      } else {
        messageBarRef.current?.addMessage("错误", "描述修改失败", "error");
      }
      setDescrEditing(null);
      setEditing(Math.random());
    }
  };

  const handleDescrEditCancel = () => {
    setDescrEditing(null);
    setDescrEditValue("");
    setEditing(Math.random());
  };

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarInput("上传中...");
    const { uploadImage } = await import("@/utils/image");
    const url = await uploadImage(file);
    setAvatarInput(url || "上传失败");
  }

  // 删除分组
  const handleDeleteGroup = async () => {
    if (deleteGroupIdx !== null) {
      const groupName = nav[deleteGroupIdx].name;
      const ok = await deleteGroup(groupName);
      if (ok) {
        setNav((prev) => prev.filter((_, idx) => idx !== deleteGroupIdx));
        messageBarRef.current?.addMessage("提示", "删除分组成功", "success");
      } else {
        messageBarRef.current?.addMessage("错误", "删除分组失败", "error");
      }
      setDeleteGroupIdx(null);
      setEditing(Math.random());
    }
  };

  // 删除网页链接
  const handleDeleteLink = async () => {
    if (deleteLinkInfo) {
      const groupName = nav[deleteLinkInfo.groupIdx].name;
      const linkId =
        nav[deleteLinkInfo.groupIdx].links[deleteLinkInfo.linkIdx].id;
      const ok = await deleteNav(groupName, linkId);
      if (ok) {
        setNav((prev) =>
          prev.map((group, gi) =>
            gi === deleteLinkInfo.groupIdx
              ? {
                  ...group,
                  links: group.links.filter(
                    (_, li) => li !== deleteLinkInfo.linkIdx
                  ),
                }
              : group
          )
        );
        messageBarRef.current?.addMessage("提示", "删除网页链接成功", "success");
      } else {
        messageBarRef.current?.addMessage("错误", "删除网页链接失败", "error");
      }
      setDeleteLinkInfo(null);
      setEditing(Math.random());
    }
  };

  return (
    <>
      <BaseDialog
        title="编辑头像"
        open={!!avatarEditing}
        onClose={() => {
          setAvatarEditing(null);
          setEditing(Math.random());
        }}
        onConfirm={async () => {
          if (!isValidUrl(avatarInput)) {
            messageBarRef.current?.addMessage(
              "错误",
              "请输入合法的图片链接（以 http:// 或 https:// 开头）",
              "error"
            );
            return;
          }
          if (avatarEditing) {
            const group = nav[avatarEditing.groupIdx];
            const link = group.links[avatarEditing.linkIdx];
            const updated = { ...link, avatar: avatarInput };
            const ok = await updateNav(group.name, updated);
            if (ok) {
              setNav((prev) =>
                prev.map((g, gi) =>
                  gi === avatarEditing.groupIdx
                    ? {
                        ...g,
                        links: g.links.map((l, li) =>
                          li === avatarEditing.linkIdx ? updated : l
                        ),
                      }
                    : g
                )
              );
              messageBarRef.current?.addMessage(
                "提示",
                "头像修改成功",
                "success"
              );
            } else {
              messageBarRef.current?.addMessage(
                "错误",
                "头像修改失败",
                "error"
              );
            }
          }
          setAvatarEditing(null);
          setEditing(Math.random());
        }}
        content={
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {avatarInput && (
              <img
                src={avatarInput}
                alt="预览"
                style={{ width: 36, height: 36, borderRadius: "50%" }}
                onError={(e) => (e.currentTarget.src = config.falldownAvatar)}
              />
            )}
            <Input
              value={avatarInput}
              onChange={(_, data) => setAvatarInput(data.value)}
              placeholder="输入图片链接"
              style={{ height: "fit-content", width: "100%" }}
            />
            <Button
              onClick={() => uploadRef.current?.click()}
              appearance="secondary"
              icon={<ArrowUploadFilled />}
              style={{ height: "fit-content" }}
            />
            <div>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
              />
            </div>
          </div>
        }
      />
      <BaseDialog
        title="编辑分组"
        open={!!groupEditing}
        onClose={() => {
          setGroupEditing(null);
          setEditing(Math.random());
        }}
        onConfirm={async () => {
          if (groupEditing) {
            const oldName = nav[groupEditing.groupIdx].name;
            const ok = await updateGroup(
              oldName,
              groupEditing.name,
              groupEditing.description,
              groupEditing.order ?? 0
            );
            if (ok) {
              setNav((prev) =>
                prev
                  .map((group, gi) =>
                    gi === groupEditing.groupIdx
                      ? {
                          ...group,
                          name: groupEditing.name,
                          description: groupEditing.description,
                          order: groupEditing.order ?? 0,
                        }
                      : group
                  )
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              );
              messageBarRef.current?.addMessage(
                "提示",
                "分组修改成功",
                "success"
              );
            } else {
              messageBarRef.current?.addMessage(
                "错误",
                "分组修改失败",
                "error"
              );
            }
          }
          setGroupEditing(null);
          setEditing(Math.random());
        }}
        content={
          groupEditing && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label>分组名称</Label>
              <Input
                value={groupEditing.name}
                onChange={(_, data) =>
                  setGroupEditing({ ...groupEditing, name: data.value })
                }
                placeholder="分组名称"
                style={{ width: "100%" }}
              />
              <Label>分组描述</Label>
              <Input
                value={groupEditing.description}
                onChange={(_, data) =>
                  setGroupEditing({ ...groupEditing, description: data.value })
                }
                placeholder="分组描述"
                style={{ width: "100%" }}
              />
              <Label>分组排序</Label>
              <SpinButton
                defaultValue={groupEditing.order ?? 0}
                max={1919810}
                min={-1919810}
                onChange={(_, data) =>
                  setGroupEditing({
                    ...groupEditing,
                    order: Number(data.displayValue ?? 0),
                  })
                }
                placeholder="分组排序"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>
          )
        }
      />
      {/* 删除分组确认对话框 */}
      <BaseDialog
        title="确认删除分组"
        open={deleteGroupIdx !== null}
        onClose={() => {
          setDeleteGroupIdx(null);
          setEditing(Math.random());
        }}
        onConfirm={handleDeleteGroup}
        content={<div>确定要删除该分组吗？分组下所有网页链接都会被永久删除！（真的很久！）</div>}
      />

      {/* 删除网页链接确认对话框 */}
      <BaseDialog
        title="确认删除网页链接"
        open={deleteLinkInfo !== null}
        onClose={() => {
          setDeleteLinkInfo(null);
          setEditing(Math.random());
        }}
        onConfirm={handleDeleteLink}
        content={<div>确定要删除该网页链接吗？将会被永久删除！（真的很久！）</div>}
      />

      {/* 新建分组对话框 */}
      <BaseDialog
        title="新建分组"
        open={newGroupDialogOpen}
        onClose={() => {
          setNewGroupDialogOpen(false);
          setNewGroupName("");
          setNewGroupDesc("");
          setNewOrder(
            nav.length > 0
              ? Math.max(...nav.map((g) => g.order ?? 0))
              : 0 + 1
          );
          setEditing(Math.random());
        }}
        onConfirm={async () => {
          if (newGroupName.trim()) {
            setNewOrder(
              nav.length > 0
                ? Math.max(...nav.map((g) => g.order ?? 0))
                : 0 + 1
            );
            const ok = await addGroup(
              newGroupName.trim(),
              newGroupDesc.trim(),
              newOrder
            );
            if (ok) {
              setNav((prev) =>
                [
                  ...prev,
                  {
                    name: newGroupName.trim(),
                    description: newGroupDesc.trim(),
                    links: [],
                    order: newOrder,
                  },
                ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              );
              setNewGroupDialogOpen(false);
              setNewGroupName("");
              setNewGroupDesc("");
              messageBarRef.current?.addMessage(
                "提示",
                "新建分组成功",
                "success"
              );
            } else {
              messageBarRef.current?.addMessage(
                "错误",
                "新建分组失败",
                "error"
              );
            }
            setEditing(Math.random());
          }
        }}
        content={
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label>分组名称</Label>
            <Input
              value={newGroupName}
              onChange={(_, data) => setNewGroupName(data.value)}
              placeholder="分组名称"
              style={{ width: "100%" }}
            />
            <Label>分组描述</Label>
            <Input
              value={newGroupDesc}
              onChange={(_, data) => setNewGroupDesc(data.value)}
              placeholder="分组描述"
              style={{ width: "100%" }}
            />
            <Label>分组排序</Label>
            <SpinButton
              defaultValue={
                nav.length > 0
                  ? Math.max(...nav.map((g) => g.order ?? 0))
                  : 0 + 1
              }
              max={1919810}
              min={-1919810}
              onChange={(_, data) =>
                setNewOrder(Number(data.displayValue ?? 0))
              }
              placeholder="分组排序"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
        }
      />

      {/* 移动网页链接对话框 */}
      <BaseDialog
        title="移动网页链接到其他分组"
        open={!!moveLinkInfo}
        onClose={() => {
          setMoveLinkInfo(null);
          setEditing(Math.random());
        }}
        onConfirm={async () => {
          if (
            moveLinkInfo &&
            moveTargetGroup !== null &&
            moveTargetGroup !== moveLinkInfo.groupIdx
          ) {
            const fromGroup = nav[moveLinkInfo.groupIdx].name;
            const toGroup = nav[moveTargetGroup].name;
            const linkId =
              nav[moveLinkInfo.groupIdx].links[moveLinkInfo.linkIdx].id;
            const ok = await moveNavGroup(fromGroup, toGroup, linkId);
            if (ok) {
              setNav((prev) => {
                const link =
                  prev[moveLinkInfo.groupIdx].links[moveLinkInfo.linkIdx];
                return prev.map((group, gi) => {
                  if (gi === moveLinkInfo.groupIdx) {
                    // 移除
                    return {
                      ...group,
                      links: group.links.filter(
                        (_, li) => li !== moveLinkInfo.linkIdx
                      ),
                    };
                  }
                  if (gi === moveTargetGroup) {
                    // 添加
                    return {
                      ...group,
                      links: [...group.links, link],
                    };
                  }
                  return group;
                });
              });
              messageBarRef.current?.addMessage("提示", "移动成功", "success");
            } else {
              messageBarRef.current?.addMessage("错误", "移动失败", "error");
            }
            setMoveLinkInfo(null);
            setMoveTargetGroup(null);
            setEditing(Math.random());
          }
        }}
        content={
          <div>
            <Dropdown
              value={
                moveTargetGroup !== null
                  ? nav[moveTargetGroup]?.name
                  : "请选择目标分组"
              }
              onOptionSelect={(_, data) => {
                setMoveTargetGroup(Number(data.optionValue));
              }}
              style={{ width: "100%" }}
            >
              {nav.map((g, idx) =>
                moveLinkInfo && idx === moveLinkInfo.groupIdx ? null : (
                  <Option key={g.name} value={idx.toString()}>
                    {g.name}
                  </Option>
                )
              )}
            </Dropdown>
          </div>
        }
      />

      {/* 编辑网页链接链接对话框 */}
      <BaseDialog
        title="编辑网页链接链接"
        open={!!urlEditing}
        onClose={() => {
          setUrlEditing(null);
          setEditing(Math.random());
        }}
        onConfirm={async () => {
          if (!isValidUrl(urlEditValue)) {
            messageBarRef.current?.addMessage(
              "错误",
              "请输入合法的链接（以 http:// 或 https:// 开头）",
              "error"
            );
            return;
          }
          if (urlEditing) {
            const group = nav[urlEditing.groupIdx];
            const link = group.links[urlEditing.linkIdx];
            const updated = { ...link, url: urlEditValue };
            const ok = await updateNav(group.name, updated);
            if (ok) {
              setNav((prev) =>
                prev.map((g, gi) =>
                  gi === urlEditing.groupIdx
                    ? {
                        ...g,
                        links: g.links.map((l, li) =>
                          li === urlEditing.linkIdx ? updated : l
                        ),
                      }
                    : g
                )
              );
              messageBarRef.current?.addMessage(
                "提示",
                "链接修改成功",
                "success"
              );
            } else {
              messageBarRef.current?.addMessage(
                "错误",
                "链接修改失败",
                "error"
              );
            }
            setUrlEditing(null);
            setEditing(Math.random());
          }
        }}
        content={
          <Input
            value={urlEditValue}
            onChange={(_, data) => setUrlEditValue(data.value)}
            placeholder="请输入新的网页链接地址"
            style={{ width: "100%" }}
          />
        }
      />

      <h1>网址收藏</h1>
      <div className="nav-groups">
        <div className="nav-topbar">
          <Button
            appearance="primary"
            icon={<AddRegular />}
            onClick={() => {
              setNewOrder(
                nav.length > 0
                  ? Math.max(...nav.map((g) => g.order ?? 0))
                  : 0 + 1
              );
              setNewGroupDialogOpen(true);
              setEditing(Math.random());
            }}
          >
            新建分组
          </Button>
          <Button
            appearance="secondary"
            icon={<ArrowClockwiseRegular />}
            onClick={() => {
              dispatchCheckLatencyWorkflow().then((ok) => {
                if (ok) {
                  messageBarRef.current?.addMessage(
                    "提示",
                    "网页链接延迟检查已开始，可能需要几分钟，保持您的Internet连接到集线器，坐和放宽。",
                    "success"
                  );
                } else {
                  messageBarRef.current?.addMessage(
                    "错误",
                    "网页链接延迟检查失败",
                    "error"
                  );
                }
              });
            }}
          >
            重新检查延迟
          </Button>
        </div>
        <h4 style={{marginTop:10, marginBottom: 0}}>
          总计{" "}
          {nav
            .map((g) => g.links.length)
            .reduce((prev, curr) => prev + curr, 0)}{" "}
          个网页链接
        </h4>
        {nav
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item, groupIdx) => (
            <div className="nav-group" key={item.name}>
              <div className="nav-group-header">
                <h2
                  className="nav-group-title"
                  style={{ display: "inline-block", marginRight: 8 }}
                >
                  {item.name}
                </h2>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<EditFilled />}
                  aria-label="编辑分组"
                  title="编辑分组"
                  onClick={() => {
                    setGroupEditing({
                      groupIdx,
                      name: item.name,
                      description: item.description || "",
                      order: item.order ?? 0, // 必须加上
                    });
                    setEditing(Math.random());
                  }}
                  style={{ verticalAlign: "middle" }}
                />
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<DeleteRegular />}
                  aria-label="删除分组"
                  title="删除分组"
                  onClick={() => {
                    setDeleteGroupIdx(groupIdx);
                    setEditing(Math.random());
                  }}
                  style={{
                    verticalAlign: "middle",
                    marginLeft: 4,
                    color: "red",
                  }}
                />
                <Button
                  appearance="subtle"
                  icon={<AddRegular />}
                  size="small"
                  aria-label="添加该分组下网页链接"
                  title="添加该分组下网页链接"
                  onClick={async () => {
                    const newLink = {
                      name: "新网页链接喵",
                      description: "114514",
                      url: "https://0v0.my",
                      color: "#66ccff",
                      avatar: "https://img.0v0.my/2024/09/06/66dabf7f748c8.jpg",
                      id: stringRandom(32, { letters: "abcdef" }),
                      latency: 0.114,
                    };
                    const groupName = nav[groupIdx].name;
                    const ok = await addNav(groupName, newLink);
                    if (ok) {
                      setNav((prev) =>
                        prev.map((group, gi) =>
                          gi === groupIdx
                            ? { ...group, links: [...group.links, newLink] }
                            : group
                        )
                      );
                      messageBarRef.current?.addMessage(
                        "提示",
                        "添加网页链接成功",
                        "success"
                      );
                    } else {
                      messageBarRef.current?.addMessage(
                        "错误",
                        "添加失败",
                        "error"
                      );
                    }
                    setEditing(Math.random());
                  }}
                />
                <span className="nav-group-descr">{item.description}</span>
                <span className="nav-group-count">
                  共 {item.links.length} 个网页链接
                </span>
              </div>
              <div className="nav-list">
                {item.links.map((link, linkIdx) => {
                  let linkLatencyColor = "";
                  if (link.latency! > 0) {
                    if (link.latency! < 1) linkLatencyColor = "green";
                    else if (link.latency! < 2)
                      linkLatencyColor = "yellowgreen";
                    else if (link.latency! < 5) linkLatencyColor = "goldenrod";
                    else linkLatencyColor = "orangered";
                  } else if (link.latency) {
                    linkLatencyColor = "#bd2a2a";
                  }
                  const isEditing =
                    nameEditing &&
                    nameEditing.groupIdx === groupIdx &&
                    nameEditing.linkIdx === linkIdx;
                  const isColorEditing =
                    colorEditing &&
                    colorEditing.groupIdx === groupIdx &&
                    colorEditing.linkIdx === linkIdx;
                  const isDescrEditing =
                    descrEditing &&
                    descrEditing.groupIdx === groupIdx &&
                    descrEditing.linkIdx === linkIdx;
                  return (
                    <div className="nav-item" key={link.name}>
                      {/* 头像渲染 */}
                      <div
                        className="nav-item-avatar"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setAvatarEditing({
                            groupIdx,
                            linkIdx,
                            avatar: link.avatar,
                          });
                          setAvatarInput(link.avatar || "");
                          setEditing(Math.random());
                        }}
                        dangerouslySetInnerHTML={{
                          __html: `
                            <img 
                                class="nav-item-avatar-img lazy-img" 
                                src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" 
                                data-src="${link.avatar}"
                                alt="${link.name}"
                                onerror="this.src='${config.falldownAvatar}';"
                            />
                          `,
                        }}
                      />

                      <span className="nav-item-name">
                        {isEditing ? (
                          <Input
                            value={nameEditValue}
                            onChange={(_, data) => setNameEditValue(data.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditConfirm();
                              if (e.key === "Escape") handleEditCancel();
                            }}
                            className="nav-item-name-edit"
                            autoFocus
                            size="small"
                            contentAfter={
                              <>
                                <Button
                                  appearance="subtle"
                                  size="small"
                                  icon={<Checkmark16Regular />}
                                  onClick={handleEditConfirm}
                                  aria-label="确认"
                                />
                                <Button
                                  appearance="subtle"
                                  size="small"
                                  icon={<Dismiss16Regular />}
                                  onClick={handleEditCancel}
                                  aria-label="取消"
                                />
                              </>
                            }
                          />
                        ) : (
                          <>
                            <button
                              className="nav-item-button"
                              onClick={() => {
                                handleEdit(groupIdx, linkIdx, link.name);
                                setEditing(Math.random());
                              }}
                            >
                              <EditFilled />
                            </button>
                            <span
                              className="nav-item-name-text"
                              title={link.name}
                            >
                              {link.name}
                            </span>
                          </>
                        )}
                      </span>
                      <div className="nav-item-color">
                        <div className="nav-item-color-text">
                          {isColorEditing ? (
                            <>
                              <input
                                type="color"
                                className="nav-item-color-box"
                                style={{
                                  backgroundColor: colorEditing.color,
                                }}
                                value={colorEditing.color}
                                onChange={(e) =>
                                  setColorEditing({
                                    groupIdx,
                                    linkIdx,
                                    color: e.target.value,
                                  })
                                }
                                title="选择颜色"
                                autoFocus
                              />
                              <Button
                                appearance="subtle"
                                size="small"
                                icon={<Color24Regular />}
                                aria-label="取色"
                                onClick={async () => {
                                  if ("EyeDropper" in window) {
                                    // @ts-ignore
                                    const eyeDropper = new window.EyeDropper();
                                    try {
                                      const result = await eyeDropper.open();
                                      setColorEditing({
                                        groupIdx,
                                        linkIdx,
                                        color: result.sRGBHex,
                                      });
                                    } catch (e) {}
                                  } else {
                                    messageBarRef.current?.addMessage(
                                      "错误",
                                      "当前浏览器不支持取色器功能",
                                      "error"
                                    );
                                  }
                                }}
                                style={{ marginLeft: 4 }}
                              />
                              <Button
                                appearance="subtle"
                                size="small"
                                icon={<Checkmark16Regular />}
                                onClick={async () => {
                                  const group = nav[groupIdx];
                                  const link = group.links[linkIdx];
                                  const updated = {
                                    ...link,
                                    color: colorEditing.color,
                                  };
                                  const ok = await updateNav(
                                    group.name,
                                    updated
                                  );
                                  if (ok) {
                                    setNav((prev) =>
                                      prev.map((g, gi) =>
                                        gi === groupIdx
                                          ? {
                                              ...g,
                                              links: g.links.map((l, li) =>
                                                li === linkIdx ? updated : l
                                              ),
                                            }
                                          : g
                                      )
                                    );
                                    messageBarRef.current?.addMessage(
                                      "提示",
                                      "颜色修改成功",
                                      "success"
                                    );
                                  } else {
                                    messageBarRef.current?.addMessage(
                                      "错误",
                                      "颜色修改失败",
                                      "error"
                                    );
                                  }
                                  setColorEditing(null);
                                  setEditing(Math.random());
                                }}
                                aria-label="确认"
                              />
                              <Button
                                appearance="subtle"
                                size="small"
                                icon={<Dismiss16Regular />}
                                onClick={() => {
                                  setColorEditing(null);
                                  setEditing(Math.random());
                                }}
                                aria-label="取消"
                              />
                              <span style={{ marginLeft: 8 }}>
                                {colorEditing.color}
                              </span>
                            </>
                          ) : (
                            <>
                              <span
                                className="nav-item-color-box"
                                style={{
                                  display: "inline-block",
                                  backgroundColor: link.color,
                                }}
                                title="点击编辑颜色"
                                onClick={() => {
                                  setColorEditing({
                                    groupIdx,
                                    linkIdx,
                                    color: link.color,
                                  });
                                  setEditing(Math.random());
                                }}
                              />
                              <span
                                className="nav-item-latency"
                                style={{ color: linkLatencyColor }}
                              >
                                {link.latency! > 0
                                  ? ` ${Math.round(link.latency! * 1000)}ms`
                                  : " Error"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="nav-item-descr">
                        {isDescrEditing ? (
                          <Input
                            value={descrEditValue}
                            onChange={(_, data) =>
                              setDescrEditValue(data.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleDescrEditConfirm();
                              if (e.key === "Escape") handleDescrEditCancel();
                            }}
                            className="nav-item-descr-edit"
                            autoFocus
                            size="small"
                            contentAfter={
                              <>
                                <Button
                                  appearance="subtle"
                                  size="small"
                                  icon={<Checkmark16Regular />}
                                  onClick={handleDescrEditConfirm}
                                  aria-label="确认"
                                />
                                <Button
                                  appearance="subtle"
                                  size="small"
                                  icon={<Dismiss16Regular />}
                                  onClick={handleDescrEditCancel}
                                  aria-label="取消"
                                />
                              </>
                            }
                          />
                        ) : (
                          <>
                            <button
                              className="nav-item-button"
                              style={{ marginRight: 4 }}
                              onClick={() => {
                                handleDescrEdit(
                                  groupIdx,
                                  linkIdx,
                                  link.description || ""
                                );
                                setEditing(Math.random());
                              }}
                            >
                              <ComposeRegular />
                            </button>
                            <div className="nav-item-descr-text">
                              {link.description}
                            </div>
                          </>
                        )}
                      </div>
                      <Link
                        className="nav-item-button open"
                        href={link.url}
                        aria-label="打开链接"
                        title="打开链接"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenFilled />
                      </Link>

                      <button
                        className="nav-item-button editlink"
                        aria-label="编辑链接"
                        title="编辑链接"
                        onClick={() => {
                          setUrlEditing({ groupIdx, linkIdx });
                          setUrlEditValue(link.url);
                          setEditing(Math.random());
                        }}
                      >
                        <LinkEditRegular />
                      </button>
                      <button
                        className="nav-item-button delete"
                        onClick={() => {
                          setDeleteLinkInfo({ groupIdx, linkIdx });
                          setEditing(Math.random());
                        }}
                        style={{ marginLeft: 2 }}
                        title="删除网页链接"
                        aria-label="删除网页链接"
                      >
                        <DeleteRegular />
                      </button>
                      <Button
                        appearance="subtle"
                        size="small"
                        icon={<ArrowLeftRegular />}
                        aria-label="移动分组"
                        style={{ width: "fit-content" }}
                        onClick={() => {
                          setMoveLinkInfo({ groupIdx, linkIdx });
                          setMoveTargetGroup(null);
                          setEditing(Math.random());
                        }}
                      >
                        移动分组
                      </Button>
                    </div>
                  );
                })}
                {/* 添加网页链接按钮 */}
                <Button
                  appearance="subtle"
                  icon={<AddRegular />}
                  className="nav-group-addlinkbtn"
                  onClick={async () => {
                    const newLink = {
                      name: "新网页链接喵",
                      description: "114514",
                      url: "https://0v0.my",
                      color: "#66ccff",
                      avatar: "https://img.0v0.my/2024/09/06/66dabf7f748c8.jpg",
                      id: stringRandom(32, { letters: "abcdef" }),
                      latency: 0.114,
                    };
                    const groupName = nav[groupIdx].name;
                    const ok = await addNav(groupName, newLink);
                    if (ok) {
                      setNav((prev) =>
                        prev.map((group, gi) =>
                          gi === groupIdx
                            ? { ...group, links: [...group.links, newLink] }
                            : group
                        )
                      );
                      messageBarRef.current?.addMessage(
                        "提示",
                        "添加网页链接成功",
                        "success"
                      );
                    } else {
                      messageBarRef.current?.addMessage(
                        "错误",
                        "添加失败",
                        "error"
                      );
                    }
                    setEditing(Math.random());
                  }}
                >
                  添加网页链接
                </Button>
              </div>
            </div>
          ))}
      </div>
      <Messages ref={messageBarRef} />
    </>
  );
}
