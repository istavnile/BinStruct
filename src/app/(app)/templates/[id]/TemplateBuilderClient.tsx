"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  FileCode, FileArchive, Save, Folder, File, FolderTree,
  FolderOpen, Plus, Trash2, ChevronRight, ChevronDown, ArrowLeft,
} from "lucide-react";
import { updateTemplate } from "@/actions/templates";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Link from "next/link";

const SECTION_COLORS = [
  "#00ff9d", // green
  "#00d4ff", // cyan
  "#ff2d78", // pink
  "#ffb800", // amber
  "#9d5cff", // purple
  "#ff6b35", // orange
  "#00ffcc", // mint
  "#ff4545", // red
];

type Node = {
  name: string;
  type: "folder" | "file";
  children?: Node[];
  content?: string;
  _id?: string;
  _expanded?: boolean;
};

function addIdsToTree(node: any): Node {
  return {
    ...node,
    _id: uuidv4(),
    _expanded: true,
    children: node.children?.map(addIdsToTree) || (node.type === "folder" ? [] : undefined),
  };
}

function removeIdsFromTree(node: Node): any {
  const { _id, _expanded, ...rest } = node;
  return { ...rest, children: rest.children?.map(removeIdsFromTree) };
}

export function TemplateBuilderClient({ initialTemplate }: { initialTemplate: any }) {
  const [template, setTemplate] = useState(initialTemplate);
  const [tree, setTree] = useState<Node>(addIdsToTree(initialTemplate.structure));
  const [saving, setSaving] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(tree._id || null);
  const [isCreateOnDiskOpen, setIsCreateOnDiskOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanStructure = removeIdsFromTree(tree);
      const updated = await updateTemplate(template.id, template.name, template.description || "", cleanStructure);
      setTemplate(updated);
      toast.success("Template guardado");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleExportZIP = async () => {
    const zip = new JSZip();
    const addToZip = (node: Node, dir: JSZip) => {
      if (node.type === "file") {
        dir.file(node.name, node.content || "");
      } else {
        const folder = dir.folder(node.name);
        if (folder) {
          if (!node.children?.length) folder.file(".gitkeep", "");
          else node.children.forEach((c) => addToZip(c, folder));
        }
      }
    };
    if (tree.type === "folder") {
      if (!tree.children?.length) zip.folder(tree.name)?.file(".gitkeep", "");
      else { const r = zip.folder(tree.name); tree.children.forEach((c) => addToZip(c, r!)); }
    } else {
      zip.file(tree.name, tree.content || "");
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${template.name.replace(/\s+/g, "_")}.zip`);
    toast.success("ZIP exportado");
  };

  const handleCreateOnDisk = async () => {
    if (!("showDirectoryPicker" in window)) {
      toast.error("Tu navegador no soporta esta función. Usa Chrome, Edge o Safari.");
      return;
    }
    setIsCreateOnDiskOpen(false);
    try {
      const parentDir = await (window as any).showDirectoryPicker({ mode: "readwrite" });
      const buildDir = async (node: Node, dir: FileSystemDirectoryHandle) => {
        if (node.type === "folder") {
          const sub = await dir.getDirectoryHandle(node.name, { create: true });
          if (node.children?.length) { for (const c of node.children) await buildDir(c, sub); }
          else { const f = await sub.getFileHandle(".gitkeep", { create: true }); const w = await f.createWritable(); await w.write(""); await w.close(); }
        } else {
          const fh = await dir.getFileHandle(node.name, { create: true });
          const w = await fh.createWritable(); await w.write(node.content ?? ""); await w.close();
        }
      };
      await buildDir(tree, parentDir);
      toast.success(`"${tree.name}" creado en ${parentDir.name}`);
    } catch (err: any) {
      if (err.name !== "AbortError") toast.error("Error al crear carpetas en disco");
    }
  };

  const updateNodeDeep = (cur: Node, targetId: string, fn: (n: Node) => Node): Node => {
    if (cur._id === targetId) return fn(cur);
    if (cur.children) return { ...cur, children: cur.children.map((c) => updateNodeDeep(c, targetId, fn)) };
    return cur;
  };

  const deleteNodeDeep = (cur: Node, targetId: string): Node | null => {
    if (cur._id === targetId) return null;
    if (cur.children) return { ...cur, children: cur.children.map((c) => deleteNodeDeep(c, targetId)).filter(Boolean) as Node[] };
    return cur;
  };

  const addNode = (parentId: string, type: "folder" | "file") => {
    const newNode: Node = {
      name: type === "folder" ? "nueva_carpeta" : "nuevo_archivo.txt",
      type,
      _id: uuidv4(),
      _expanded: true,
      children: type === "folder" ? [] : undefined,
    };
    setTree((prev) => updateNodeDeep(prev, parentId, (n) => ({ ...n, _expanded: true, children: [...(n.children || []), newNode] })));
    setSelectedNodeId(newNode._id!);
  };

  const deleteNode = (id: string) => {
    if (id === tree._id) { toast.error("No puedes eliminar el nodo raíz"); return; }
    setTree((prev) => deleteNodeDeep(prev, id) as Node);
    if (selectedNodeId === id) setSelectedNodeId(tree._id!);
  };

  const renderTree = (node: Node, depth = 0, tintColor = "#00ff9d", siblingIndex = 0) => {
    const isSelected = selectedNodeId === node._id;
    const isFolder = node.type === "folder";
    const isRoot = node._id === tree._id;

    // Each depth-1 child gets its own section color; deeper nodes inherit it
    const effectiveColor = isRoot
      ? "#00ff9d"
      : depth === 1
        ? SECTION_COLORS[siblingIndex % SECTION_COLORS.length]
        : tintColor;

    // Visual weight: depth-1 folders are slightly brighter when unselected
    const nameColor = isSelected
      ? effectiveColor
      : depth <= 1
        ? "#5a7080"
        : "#3d4f60";

    const folderIconColor = isSelected
      ? effectiveColor
      : `${effectiveColor}${depth === 0 ? "99" : depth === 1 ? "80" : "55"}`;

    return (
      <div key={node._id} className="w-full">
        <div
          className="group flex items-center cursor-pointer select-none py-[3px] pr-2 border-l-2 transition-all duration-100 hover:bg-[#1c2232]/30"
          style={{
            paddingLeft: `${depth * 14 + 8}px`,
            borderLeftColor: isSelected ? effectiveColor : "transparent",
            backgroundColor: isSelected ? `${effectiveColor}0d` : undefined,
          }}
          onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node._id!); }}
        >
          {/* Expand toggle */}
          {isFolder ? (
            <button
              onClick={(e) => { e.stopPropagation(); setTree((p) => updateNodeDeep(p, node._id!, (n) => ({ ...n, _expanded: !n._expanded }))); }}
              className="mr-0.5 flex h-4 w-4 shrink-0 items-center justify-center"
            >
              {node._expanded
                ? <ChevronDown size={10} style={{ color: isSelected ? effectiveColor : "#3d4f60" }} />
                : <ChevronRight size={10} style={{ color: isSelected ? effectiveColor : "#3d4f60" }} />
              }
            </button>
          ) : (
            <span className="mr-0.5 inline-block h-4 w-4 shrink-0" />
          )}

          {isFolder ? (
            <Folder size={12} className="mr-1.5 shrink-0 transition-colors" style={{ color: folderIconColor }} />
          ) : (
            <File size={12} className="mr-1.5 shrink-0 transition-colors" style={{ color: isSelected ? "#00d4ff" : "#2a3a4a" }} />
          )}

          <span
            className={`font-mono flex-1 truncate max-w-[160px] transition-colors ${depth === 1 ? "text-[11px] font-medium" : "text-[11px]"}`}
            style={{ color: nameColor }}
          >
            {node.name}
          </span>

          {/* Action buttons */}
          <div className={`flex items-center gap-0.5 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            {isFolder && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); addNode(node._id!, "file"); }}
                  className="flex h-5 w-5 items-center justify-center text-[#3d4f60] hover:text-[#00d4ff] transition-colors"
                  title="Nuevo archivo"
                >
                  <File size={10} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); addNode(node._id!, "folder"); }}
                  className="flex h-5 w-5 items-center justify-center text-[#3d4f60] hover:text-[#00ff9d] transition-colors"
                  title="Nueva carpeta"
                >
                  <Folder size={10} />
                </button>
              </>
            )}
            {!isRoot && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteNode(node._id!); }}
                className="flex h-5 w-5 items-center justify-center text-[#3d4f60] hover:text-[#ff4545] transition-colors"
                title="Eliminar"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        </div>

        {isFolder && node._expanded && node.children && (
          <div className="w-full">
            {node.children.map((child, i) => renderTree(child, depth + 1, effectiveColor, i))}
          </div>
        )}
      </div>
    );
  };

  let selectedNode: Node | null = null;
  const findSelected = (n: Node) => {
    if (n._id === selectedNodeId) selectedNode = n;
    if (n.children) n.children.forEach(findSelected);
  };
  findSelected(tree);

  return (
    <div className="flex flex-col h-full gap-0">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#1c2232] bg-[#080a0f] px-5 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/templates" className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> templates
          </Link>
          <span className="text-[#1c2232] select-none">/</span>
          <div>
            <span className="font-mono text-[11px] font-semibold text-[#c9d5e0]">{template.name}</span>
            {template.description && (
              <span className="font-mono text-[10px] text-[#3d4f60] ml-2">— {template.description}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsCreateOnDiskOpen(true)}
            className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-3 py-1.5 flex items-center gap-1.5 transition-all"
          >
            <FolderOpen size={12} /> en_disco
          </button>
          <button
            onClick={handleExportZIP}
            className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-3 py-1.5 flex items-center gap-1.5 transition-all"
          >
            <FileArchive size={12} /> export_zip
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="font-mono text-[11px] text-[#00ff9d] border border-[#00ff9d]/40 bg-[#00ff9d]/8 hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 px-3 py-1.5 flex items-center gap-1.5 transition-all disabled:opacity-40"
          >
            <Save size={12} /> {saving ? "guardando…" : "$ guardar"}
          </button>
        </div>
      </div>

      {/* ── IDE layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden border-b border-[#1c2232]">
        {/* Tree panel */}
        <div className="w-[220px] shrink-0 border-r border-[#1c2232] bg-[#080a0f] flex flex-col">
          <div className="border-b border-[#1c2232] px-3 py-2 flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#3d4f60]">// ESTRUCTURA</span>
            <button
              onClick={() => addNode(tree._id!, "folder")}
              className="font-mono text-[10px] text-[#3d4f60] hover:text-[#00ff9d] transition-colors"
              title="Nueva carpeta en raíz"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {renderTree(tree)}
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex-1 flex flex-col bg-[#0c0e18]">
          {selectedNode ? (
            <>
              {/* Editor header */}
              <div className="border-b border-[#1c2232] px-4 py-2 flex items-center gap-2 shrink-0">
                {selectedNode.type === "folder"
                  ? <Folder size={12} className="text-[#00ff9d]" />
                  : <File size={12} className="text-[#00d4ff]" />
                }
                <span className="font-mono text-[10px] text-[#3d4f60]">
                  // editando: <span className="text-[#c9d5e0]">{selectedNode.name}</span>
                </span>
              </div>

              <div className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto">
                {/* Name field */}
                <div className="space-y-1.5 max-w-sm">
                  <label className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
                    nombre
                  </label>
                  <Input
                    value={selectedNode.name}
                    onChange={(e) => setTree((p) => updateNodeDeep(p, selectedNodeId!, (n) => ({ ...n, name: e.target.value })))}
                    className="bg-[#080a0f] border-[#1c2232] focus-visible:border-[#00ff9d]/50 font-mono text-sm"
                  />
                </div>

                {/* File content */}
                {selectedNode.type === "file" && (
                  <div className="flex-1 flex flex-col gap-1.5 min-h-0">
                    <label className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase flex items-center justify-between">
                      contenido
                      <FileCode size={12} className="text-[#1c2232]" />
                    </label>
                    <textarea
                      className="flex-1 w-full min-h-[200px] p-3 bg-[#080a0f] border border-[#1c2232] font-mono text-xs text-[#c9d5e0] resize-none outline-none focus:border-[#00ff9d]/30 placeholder:text-[#1c2232] leading-relaxed caret-[#00ff9d]"
                      value={selectedNode.content || ""}
                      onChange={(e) => setTree((p) => updateNodeDeep(p, selectedNodeId!, (n) => ({ ...n, content: e.target.value })))}
                      placeholder="// contenido del archivo"
                      spellCheck={false}
                    />
                  </div>
                )}

                {selectedNode.type === "folder" && (
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={() => addNode(selectedNode!._id!, "file")}
                      className="font-mono text-[11px] text-[#00d4ff]/70 border border-[#00d4ff]/20 hover:border-[#00d4ff]/50 hover:text-[#00d4ff] px-3 py-1.5 flex items-center gap-1.5 transition-all"
                    >
                      <File size={11} /> + archivo
                    </button>
                    <button
                      onClick={() => addNode(selectedNode!._id!, "folder")}
                      className="font-mono text-[11px] text-[#00ff9d]/70 border border-[#00ff9d]/20 hover:border-[#00ff9d]/50 hover:text-[#00ff9d] px-3 py-1.5 flex items-center gap-1.5 transition-all"
                    >
                      <Folder size={11} /> + carpeta
                    </button>
                    {selectedNode._id !== tree._id && (
                      <button
                        onClick={() => deleteNode(selectedNode!._id!)}
                        className="font-mono text-[11px] text-[#ff4545]/70 border border-[#ff4545]/20 hover:border-[#ff4545]/50 hover:text-[#ff4545] px-3 py-1.5 flex items-center gap-1.5 transition-all ml-auto"
                      >
                        <Trash2 size={11} /> eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <FolderTree size={28} className="text-[#1c2232]" />
              <p className="font-mono text-xs text-[#3d4f60]">// selecciona un nodo para editar</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Create on disk dialog ─────────────────────────────────── */}
      <Dialog open={isCreateOnDiskOpen} onOpenChange={setIsCreateOnDiskOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[420px] rounded-none sm:rounded-none bg-[#080a0f] border border-[#1c2232] text-[#c9d5e0] p-0 gap-0 overflow-hidden"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 border-b border-[#1c2232] px-4 py-2.5 bg-[#080a0f]">
            <div className="flex gap-1.5">
              <DialogClose render={<button type="button" className="h-2.5 w-2.5 rounded-full bg-[#ff4545]/70 hover:bg-[#ff4545] transition-colors" />} />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffb800]/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#00ff9d]/50" />
            </div>
            <span className="font-mono text-[10px] text-[#3d4f60] tracking-[0.15em] mx-auto select-none">
              BINSTRUCT — CREATE_ON_DISK
            </span>
          </div>

          <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#1c2232] gap-1.5">
            <div className="flex items-center gap-2">
              <FolderOpen size={12} className="text-[#00ff9d]" />
              <DialogTitle className="font-mono text-[13px] font-semibold text-[#c9d5e0] tracking-wide">
                crear_en_disco
              </DialogTitle>
            </div>
            <DialogDescription className="font-mono text-[11px] text-[#3d4f60] pl-[20px]">
              -- elige una ubicación y el navegador creará las carpetas
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-5">
            <p className="font-mono text-[11px] text-[#5a6a7a] leading-relaxed">
              Se creará <span className="text-[#c9d5e0] font-semibold">"{tree.name}"</span> en la carpeta que elijas.
              El navegador pedirá permiso de escritura — acepta cuando aparezca el prompt.
            </p>
          </div>

          <div className="px-5 pb-5 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsCreateOnDiskOpen(false)}
              className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-4 py-1.5 transition-all"
            >
              cancelar
            </button>
            <button
              type="button"
              onClick={handleCreateOnDisk}
              className="font-mono text-[11px] text-[#00ff9d] border border-[#00ff9d]/40 bg-[#00ff9d]/8 hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 px-4 py-1.5 flex items-center gap-1.5 transition-all"
            >
              <FolderOpen size={11} /> $ elegir_ubicación
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
