"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  Plus, FileArchive, Trash, Edit,
  LayoutTemplate, ArrowRight, Upload, Download, FileJson,
  HardDrive, Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTemplate, deleteTemplate, duplicateTemplate } from "@/actions/templates";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import { PRESET_TEMPLATES, PRESET_CATEGORIES, type PresetTemplate } from "@/lib/preset-templates";
import { useTranslations } from "@/lib/translations";
import type { Lang } from "@/lib/lang";

const BLANK_STRUCTURE = {
  name: "[NOMBRE_DEL_PROYECTO]",
  type: "folder",
  children: [],
};

const CATEGORY_ACCENT: Record<string, string> = {
  Audiovisual:  "#00ff9d",
  Diseño:       "#ff2d78",
  Arquitectura: "#00d4ff",
  Desarrollo:   "#9d5cff",
};

const BINSTRUCT_VERSION = "1";

/* ── Terminal title bar ── */
function TerminalBar({ label, onClose }: { label: string; onClose?: () => void }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#1c2232] px-4 py-2.5 bg-[#080a0f] shrink-0">
      <div className="flex gap-1.5">
        {onClose ? (
          <button type="button" onClick={onClose} className="h-2.5 w-2.5 rounded-full bg-[#ff4545]/70 hover:bg-[#ff4545] transition-colors" />
        ) : (
          <DialogClose render={<button type="button" className="h-2.5 w-2.5 rounded-full bg-[#ff4545]/70 hover:bg-[#ff4545] transition-colors" />} />
        )}
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffb800]/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#00ff9d]/50" />
      </div>
      <span className="font-mono text-[10px] text-[#5a6a7a] tracking-[0.12em] mx-auto select-none">
        {label}
      </span>
    </div>
  );
}

type ImportedData = { name: string; description: string; structure: any };

export function TemplatesClient({ initialTemplates, lang = "es" }: { initialTemplates: any[]; lang?: Lang }) {
  const T = useTranslations(lang);
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const importInputRef = useRef<HTMLInputElement>(null);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetTemplate | null>(null);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string; name: string } | null>(null);
  const [exportModal, setExportModal] = useState<{ template: any; mode: "disk" | "zip"; rootName: string; vars: Record<string, string> } | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ── Resizable columns ──────────────────────────────────────────────────
  const [colWidths, setColWidths] = useState<[number, number]>([300, 420]);
  const [isDraggingCol, setIsDraggingCol] = useState<number | null>(null);
  const colWidthsRef = useRef<[number, number]>([300, 420]);
  const isResizingCol = useRef<number | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("binstruct:col-widths");
      if (saved) {
        const parsed = JSON.parse(saved) as [number, number];
        colWidthsRef.current = parsed;
        setColWidths(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isResizingCol.current === null) return;
      const delta = e.clientX - resizeStartX.current;
      const idx = isResizingCol.current;
      const newWidth = Math.max(120, resizeStartWidth.current + delta);
      const next: [number, number] = [colWidthsRef.current[0], colWidthsRef.current[1]];
      next[idx] = newWidth;
      colWidthsRef.current = next;
      setColWidths([...next]);
    };
    const onUp = () => {
      if (isResizingCol.current === null) return;
      isResizingCol.current = null;
      setIsDraggingCol(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      try { localStorage.setItem("binstruct:col-widths", JSON.stringify(colWidthsRef.current)); } catch {}
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  /* ── Open create dialog from preset or blank ── */
  const openPreset = (preset: PresetTemplate | null) => {
    setSelectedPreset(preset);
    setImportedData(null);
    setNewTemplateName(preset?.name ?? "");
    setNewTemplateDescription(preset?.description ?? "");
    setIsPickerOpen(false);
    setIsCreateOpen(true);
  };

  /* ── Open create dialog from imported JSON ── */
  const openImported = (data: ImportedData) => {
    setSelectedPreset(null);
    setImportedData(data);
    setNewTemplateName(data.name);
    setNewTemplateDescription(data.description);
    setIsPickerOpen(false);
    setIsCreateOpen(true);
  };

  /* ── Export template as .binstruct.json ── */
  const handleExportJSON = (template: any) => {
    const payload = {
      binstruct_version: BINSTRUCT_VERSION,
      name: template.name,
      description: template.description ?? "",
      structure: template.structure,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, "_")}.binstruct.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exportado");
  };

  /* ── Import from .binstruct.json file ── */
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        if (!json.structure || !json.name) throw new Error("Formato inválido");
        openImported({
          name: json.name,
          description: json.description ?? "",
          structure: json.structure,
        });
        toast.success(`"${json.name}" importado`);
      } catch {
        toast.error("Archivo inválido o corrupto");
      } finally {
        if (importInputRef.current) importInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  /* ── Create template ── */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const structure = importedData
        ? importedData.structure
        : selectedPreset
          ? selectedPreset.structure
          : BLANK_STRUCTURE;
      const newTemplate = await createTemplate(newTemplateName, newTemplateDescription, structure);
      toast.success("Template creado correctamente");
      setIsCreateOpen(false);
      router.push(`/templates/${newTemplate.id}`);
    } catch {
      toast.error("Error al crear el template");
    } finally {
      setLoading(false);
    }
  };

  /* ── Variable detection & replacement ── */
  const extractVariables = (node: any): string[] => {
    const found: string[] = [];
    const scan = (n: any) => {
      const matches = (n.name as string).match(/\[([^\]]+)\]/g) ?? [];
      matches.forEach((m) => { if (!found.includes(m)) found.push(m); });
      n.children?.forEach(scan);
    };
    scan(node);
    return found;
  };

  const applyVariables = (node: any, vars: Record<string, string>): any => {
    let name = node.name as string;
    Object.entries(vars).forEach(([token, value]) => {
      name = name.replaceAll(token, value || token);
    });
    return {
      ...node,
      name,
      children: node.children?.map((c: any) => applyVariables(c, vars)),
    };
  };

  const openExportModal = (template: any, mode: "disk" | "zip") => {
    const detectedVars = extractVariables(template.structure);
    const vars: Record<string, string> = {};
    detectedVars.forEach((v) => { vars[v] = ""; });
    setExportModal({ template, mode, rootName: template.name, vars });
  };

  /* ── Duplicate template ── */
  const handleDuplicate = async (template: any) => {
    try {
      const copy = await duplicateTemplate(template.id);
      setTemplates((prev) => [copy, ...prev]);
      toast.success(lang === "es" ? `"${copy.name}" creado` : `"${copy.name}" created`);
    } catch {
      toast.error(lang === "es" ? "Error al duplicar" : "Duplication failed");
    }
  };

  /* ── Recursive helpers ── */
  const addToZip = (zipFolder: any, nodes: any[]) => {
    for (const node of nodes) {
      if (node.type === "folder") {
        const sub = zipFolder.folder(node.name);
        if (node.children?.length) addToZip(sub, node.children);
      } else {
        zipFolder.file(node.name, node.content ?? "");
      }
    }
  };

  const createFolderStructure = async (parent: any, nodes: any[]) => {
    for (const node of nodes) {
      if (node.type === "folder") {
        const dir = await parent.getDirectoryHandle(node.name, { create: true });
        if (node.children?.length) await createFolderStructure(dir, node.children);
      } else {
        const file = await parent.getFileHandle(node.name, { create: true });
        const writable = await file.createWritable();
        await writable.write(node.content ?? "");
        await writable.close();
      }
    }
  };

  /* ── Execute export action ── */
  const handleExportAction = async () => {
    if (!exportModal) return;
    setExportLoading(true);
    const { template, mode, rootName, vars } = exportModal;
    const structure = applyVariables(template.structure, vars);
    try {
      if (mode === "zip") {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        const root = zip.folder(rootName)!;
        addToZip(root, structure.children ?? []);
        const blob = await zip.generateAsync({ type: "blob" });
        const { saveAs } = await import("file-saver");
        saveAs(blob, `${rootName}.zip`);
        toast.success(lang === "es" ? "ZIP exportado" : "ZIP exported");
        setExportModal(null);
      } else {
        const dirHandle = await (window as any).showDirectoryPicker();
        const rootDir = await dirHandle.getDirectoryHandle(rootName, { create: true });
        await createFolderStructure(rootDir, structure.children ?? []);
        toast.success(lang === "es" ? "Carpetas creadas en disco" : "Folders created on disk");
        setExportModal(null);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") toast.error(lang === "es" ? "Error al ejecutar la acción" : "Action failed");
    } finally {
      setExportLoading(false);
    }
  };

  /* ── Delete template ── */
  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      await deleteTemplate(templateToDelete.id);
      setTemplates(templates.filter((t) => t.id !== templateToDelete.id));
      toast.success("Template eliminado");
      setTemplateToDelete(null);
    } catch {
      toast.error("Error al eliminar el template");
    }
  };

  const createSubtitle = importedData
    ? `-- importado de archivo`
    : selectedPreset
      ? `-- basado en "${selectedPreset.name}"`
      : "-- estructura vacía, construye desde cero";

  return (
    <div className="space-y-6">
      {/* Hidden file input for import */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json,.binstruct.json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#00ff9d] select-none">›</span>
            <h1 className="font-mono text-xl font-bold tracking-wide text-[#c9d5e0]">{T.tpl_title}</h1>
          </div>
          <p className="font-mono text-xs text-[#3d4f60] pl-4 mt-0.5">
            {T.tpl_subtitle}
          </p>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#3d4f60] select-none pointer-events-none">$</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "es" ? "buscar plantillas…" : "search templates…"}
            className="w-full bg-[#0c0e18] border border-[#1c2232] pl-7 pr-3 py-1.5 font-mono text-[11px] text-[#c9d5e0] placeholder:text-[#2a3a4a] focus:outline-none focus:border-[#00ff9d]/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#3d4f60] hover:text-[#c9d5e0] transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => importInputRef.current?.click()}
            className="font-mono text-[11px] text-[#3d4f60] hover:text-[#00d4ff] border border-[#1c2232] hover:border-[#00d4ff]/40 px-3 py-1.5 flex items-center gap-1.5 transition-all"
          >
            <Upload className="h-3 w-3" /> {lang === "es" ? "importar" : "import"}
          </button>
          <Button onClick={() => setIsPickerOpen(true)}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            {T.tpl_new}
          </Button>
        </div>
      </div>

      {/* ── Step 1: Preset picker ───────────────────────────────────── */}
      <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-2xl rounded-none sm:rounded-none bg-[#080a0f] border border-[#1c2232] text-[#c9d5e0] p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,#00ff9d 2px,#00ff9d 3px)", backgroundSize: "100% 4px" }} />

          <div className="relative z-10"><TerminalBar label="BINSTRUCT — TEMPLATE_PICKER" /></div>

          <div className="relative z-10 px-6 pt-4 pb-3.5 border-b border-[#1c2232]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#00ff9d] select-none">›</span>
              <DialogTitle className="font-mono text-[13px] font-semibold text-[#c9d5e0] tracking-wide">
                {T.picker_title}
              </DialogTitle>
            </div>
            <DialogDescription className="font-mono text-[11px] text-[#3d4f60] mt-1.5 pl-4">
              {T.picker_subtitle}
            </DialogDescription>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-3">

            {/* Quick options row */}
            <div className="grid grid-cols-2 gap-1.5">
              {/* Desde cero */}
              <button
                onClick={() => openPreset(null)}
                className="group text-left border border-dashed border-[#00ff9d]/20 bg-[#00ff9d]/[0.02] px-4 py-3.5 transition-all duration-150 hover:border-[#00ff9d]/50 hover:bg-[#00ff9d]/[0.04]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg leading-none text-[#00ff9d]/40 transition-colors group-hover:text-[#00ff9d]/80 select-none">$</span>
                    <div>
                      <p className="font-mono text-[13px] font-semibold text-[#00ff9d]/70 transition-colors group-hover:text-[#00ff9d]">
                        {T.picker_blank_name}
                      </p>
                      <p className="font-mono text-[10px] text-[#3d4f60] mt-0.5 transition-colors group-hover:text-[#5a6a7a]">
                        {lang === "es" ? "Carpeta raíz vacía" : "Empty root folder"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 text-[#00ff9d]/60" />
                </div>
              </button>

              {/* Importar JSON */}
              <button
                onClick={() => { setIsPickerOpen(false); importInputRef.current?.click(); }}
                className="group text-left border border-dashed border-[#00d4ff]/20 bg-[#00d4ff]/[0.02] px-4 py-3.5 transition-all duration-150 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/[0.04]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <FileJson className="h-4 w-4 text-[#00d4ff]/40 group-hover:text-[#00d4ff]/80 transition-colors shrink-0" />
                    <div>
                      <p className="font-mono text-[13px] font-semibold text-[#00d4ff]/70 transition-colors group-hover:text-[#00d4ff]">
                        {lang === "es" ? "importar_json" : "import_json"}
                      </p>
                      <p className="font-mono text-[10px] text-[#3d4f60] mt-0.5 transition-colors group-hover:text-[#5a6a7a]">
                        {lang === "es" ? "Cargar .binstruct.json" : "Load .binstruct.json"}
                      </p>
                    </div>
                  </div>
                  <Upload className="h-3.5 w-3.5 shrink-0 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 text-[#00d4ff]/60" />
                </div>
              </button>
            </div>

            {/* Preset categories */}
            <div className="space-y-6 pt-3">
              {PRESET_CATEGORIES.map((category) => {
                const accent = CATEGORY_ACCENT[category] ?? "#4a5568";
                return (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] font-bold tracking-[0.18em] shrink-0" style={{ color: accent }}>
                        // {category.toUpperCase()}
                      </span>
                      <div className="flex-1 h-px" style={{ backgroundColor: `${accent}25` }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {PRESET_TEMPLATES.filter((t) => t.category === category).map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => openPreset(preset)}
                          className="group relative text-left border border-[#1c2232] bg-[#0c0e18] px-4 py-3.5 overflow-hidden transition-all duration-150 hover:border-[#2a3050] hover:bg-[#0e1220]"
                        >
                          <span className="absolute left-0 inset-y-0 w-[2px] scale-y-0 origin-center transition-transform duration-200 group-hover:scale-y-100" style={{ backgroundColor: accent }} />
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[13px] font-semibold text-[#5a6a7a] leading-snug transition-colors group-hover:text-[#c9d5e0]">
                                {preset.name}
                              </p>
                              <p className="font-mono text-[10px] text-[#2a3a4a] mt-1.5 line-clamp-2 leading-relaxed transition-colors group-hover:text-[#3d4f60]">
                                {preset.description}
                              </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: accent + "cc" }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 px-6 py-3.5 border-t border-[#1c2232] flex items-center justify-between shrink-0">
            <span className="font-mono text-[10px] text-[#1c2232] tracking-widest select-none">
              BINSTRUCT · TEMPLATE_PICKER
            </span>
            <button onClick={() => setIsPickerOpen(false)} className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] transition-colors">
              {T.picker_cancel}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Step 2: Name / description form ────────────────────────── */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { if (!open) setIsCreateOpen(false); }}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[440px] rounded-none sm:rounded-none bg-[#080a0f] border border-[#1c2232] text-[#c9d5e0] p-0 gap-0 overflow-hidden"
        >
          <TerminalBar label="BINSTRUCT — NEW_TEMPLATE" />
          <form onSubmit={handleCreate}>
            <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#1c2232] gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono select-none" style={{ color: importedData ? "#00d4ff" : "#00ff9d" }}>›</span>
                <DialogTitle className="font-mono text-[13px] font-semibold text-[#c9d5e0] tracking-wide">
                  {importedData
                    ? (lang === "es" ? "importar_plantilla" : "import_template")
                    : selectedPreset
                      ? T.create_title_preset
                      : T.create_title_blank}
                </DialogTitle>
              </div>
              <DialogDescription className="font-mono text-[11px] text-[#3d4f60] pl-4">
                {createSubtitle}
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="t-name" className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">{T.create_label_name}</Label>
                <Input id="t-name" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder={lang === "es" ? "ej. Video Corporativo 2025" : "e.g. Corporate Video 2025"} required className="bg-[#0c0e18] border-[#1c2232] focus-visible:border-[#00ff9d]/50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-desc" className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
                  {T.create_label_desc} <span className="normal-case tracking-normal text-[#1c2232]">{T.create_desc_optional}</span>
                </Label>
                <Input id="t-desc" value={newTemplateDescription} onChange={(e) => setNewTemplateDescription(e.target.value)} placeholder={lang === "es" ? "breve descripción" : "brief description"} className="bg-[#0c0e18] border-[#1c2232] focus-visible:border-[#00ff9d]/50" />
              </div>
            </div>

            <div className="px-5 pb-5 flex gap-2 justify-end">
              <button type="button" onClick={() => { setIsCreateOpen(false); setIsPickerOpen(true); }} className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-4 py-1.5 transition-all">
                {T.create_back}
              </button>
              <button type="submit" disabled={loading} className="font-mono text-[11px] text-[#00ff9d] border border-[#00ff9d]/40 bg-[#00ff9d]/8 hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 px-4 py-1.5 transition-all disabled:opacity-40">
                {loading ? T.create_creating : T.create_submit}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Templates table ─────────────────────────────────────────── */}
      <div className="border border-[#1c2232] bg-[#0c0e18] overflow-hidden">
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <colgroup>
            <col style={{ width: colWidths[0] }} />
            <col style={{ width: colWidths[1] }} />
            <col />
            <col style={{ width: 180 }} />
          </colgroup>
          <TableHeader>
            <TableRow className="border-[#1c2232] hover:bg-transparent">
              {/* NOMBRE — resizable */}
              <TableHead
                className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase py-3 px-5 relative select-none overflow-visible"
                style={{ transition: isDraggingCol === 0 ? "none" : undefined }}
              >
                {T.tpl_col_name}
                <div
                  className="absolute right-0 top-0 bottom-0 w-[6px] cursor-col-resize z-10 group"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    isResizingCol.current = 0;
                    resizeStartX.current = e.clientX;
                    resizeStartWidth.current = colWidthsRef.current[0];
                    setIsDraggingCol(0);
                    document.body.style.cursor = "col-resize";
                    document.body.style.userSelect = "none";
                  }}
                >
                  <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px transition-colors ${isDraggingCol === 0 ? "bg-[#00ff9d]/40" : "bg-transparent group-hover:bg-[#00ff9d]/25"}`} />
                </div>
              </TableHead>
              {/* DESCRIPCIÓN — resizable */}
              <TableHead
                className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase py-3 relative select-none overflow-visible"
                style={{ transition: isDraggingCol === 1 ? "none" : undefined }}
              >
                {T.tpl_col_desc}
                <div
                  className="absolute right-0 top-0 bottom-0 w-[6px] cursor-col-resize z-10 group"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    isResizingCol.current = 1;
                    resizeStartX.current = e.clientX;
                    resizeStartWidth.current = colWidthsRef.current[1];
                    setIsDraggingCol(1);
                    document.body.style.cursor = "col-resize";
                    document.body.style.userSelect = "none";
                  }}
                >
                  <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px transition-colors ${isDraggingCol === 1 ? "bg-[#00ff9d]/40" : "bg-transparent group-hover:bg-[#00ff9d]/25"}`} />
                </div>
              </TableHead>
              <TableHead className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase py-3">{T.tpl_col_updated}</TableHead>
              <TableHead className="text-right font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase py-3 px-5">{T.tpl_col_actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              const filtered = search.trim()
                ? templates.filter((t) =>
                    t.name.toLowerCase().includes(search.toLowerCase()) ||
                    (t.description ?? "").toLowerCase().includes(search.toLowerCase())
                  )
                : templates;
              if (templates.length === 0) return (
                <TableRow className="border-[#1c2232] hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <LayoutTemplate className="h-7 w-7 text-[#1c2232]" />
                      <p className="font-mono text-xs text-[#3d4f60]">{T.tpl_empty}</p>
                      <button onClick={() => setIsPickerOpen(true)} className="mt-1 font-mono text-[11px] text-[#00ff9d]/70 border border-[#00ff9d]/20 hover:border-[#00ff9d]/50 hover:text-[#00ff9d] px-4 py-1.5 transition-all flex items-center gap-1.5">
                        <Plus className="h-3 w-3" /> {T.tpl_new}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
              if (filtered.length === 0) return (
                <TableRow className="border-[#1c2232] hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-12">
                    <p className="font-mono text-xs text-[#3d4f60]">
                      {lang === "es" ? `// sin resultados para "${search}"` : `// no results for "${search}"`}
                    </p>
                  </TableCell>
                </TableRow>
              );
              return filtered.map((template) => (
                <TableRow key={template.id} className="border-[#1c2232] hover:bg-[#1c2232]/20">
                  <TableCell className="px-5 py-3">
                    <Link href={`/templates/${template.id}`} className="font-mono text-sm font-medium text-[#c9d5e0] hover:text-[#00ff9d] transition-colors">
                      {template.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[#5a7080] py-3 truncate overflow-hidden">{template.description || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-[#5a7080] py-3" suppressHydrationWarning>
                    {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true, locale: lang === "es" ? esLocale : undefined })}
                  </TableCell>
                  <TableCell className="text-right px-5 py-3">
                    <TooltipProvider delay={400}>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => router.push(`/templates/${template.id}`)}
                              className="inline-flex h-6 w-6 items-center justify-center text-[#3d4f60] hover:text-[#00ff9d] hover:bg-[#00ff9d]/8 transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0c0e18] border border-[#1c2232] text-[#00ff9d] font-mono text-[10px] tracking-wide rounded-none px-2 py-1">
                            {T.tpl_edit}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleExportJSON(template)}
                              className="inline-flex h-6 w-6 items-center justify-center text-[#3d4f60] hover:text-[#00d4ff] hover:bg-[#00d4ff]/8 transition-colors"
                            >
                              <Download className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0c0e18] border border-[#1c2232] text-[#00d4ff] font-mono text-[10px] tracking-wide rounded-none px-2 py-1">
                            {lang === "es" ? "exportar_json" : "export_json"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => openExportModal(template, "disk")}
                              className="inline-flex h-6 w-6 items-center justify-center text-[#3d4f60] hover:text-[#9d5cff] hover:bg-[#9d5cff]/8 transition-colors"
                            >
                              <HardDrive className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0c0e18] border border-[#1c2232] text-[#9d5cff] font-mono text-[10px] tracking-wide rounded-none px-2 py-1">
                            {lang === "es" ? "en_disco" : "on_disk"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => openExportModal(template, "zip")}
                              className="inline-flex h-6 w-6 items-center justify-center text-[#3d4f60] hover:text-[#ffb800] hover:bg-[#ffb800]/8 transition-colors"
                            >
                              <FileArchive className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0c0e18] border border-[#1c2232] text-[#ffb800] font-mono text-[10px] tracking-wide rounded-none px-2 py-1">
                            {lang === "es" ? "export_zip" : "export_zip"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleDuplicate(template)}
                              className="inline-flex h-6 w-6 items-center justify-center text-[#3d4f60] hover:text-[#ff6b35] hover:bg-[#ff6b35]/8 transition-colors"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0c0e18] border border-[#1c2232] text-[#ff6b35] font-mono text-[10px] tracking-wide rounded-none px-2 py-1">
                            {lang === "es" ? "duplicar" : "duplicate"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setTemplateToDelete({ id: template.id, name: template.name })}
                              className="inline-flex h-6 w-6 items-center justify-center text-[#3d4f60] hover:text-[#ff4545] hover:bg-[#ff4545]/8 transition-colors"
                            >
                              <Trash className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0c0e18] border border-[#1c2232] text-[#ff4545] font-mono text-[10px] tracking-wide rounded-none px-2 py-1">
                            {T.tpl_delete}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ));
            })()}
          </TableBody>
        </Table>
      </div>

      {/* ── Export / Disk modal ────────────────────────────────────── */}
      <Dialog open={!!exportModal} onOpenChange={(open) => { if (!open) setExportModal(null); }}>
        <DialogContent showCloseButton={false} className="sm:max-w-[400px] rounded-none sm:rounded-none bg-[#080a0f] border border-[#1c2232] text-[#c9d5e0] p-0 gap-0 overflow-hidden">
          <TerminalBar
            label={exportModal?.mode === "disk" ? "BINSTRUCT — EN_DISCO" : "BINSTRUCT — EXPORT_ZIP"}
            onClose={() => setExportModal(null)}
          />
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#1c2232] gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono select-none" style={{ color: exportModal?.mode === "disk" ? "#9d5cff" : "#ffb800" }}>›</span>
              <DialogTitle className="font-mono text-[13px] font-semibold text-[#c9d5e0] tracking-wide">
                {exportModal?.mode === "disk"
                  ? (lang === "es" ? "crear_en_disco" : "create_on_disk")
                  : (lang === "es" ? "exportar_zip" : "export_zip")}
              </DialogTitle>
            </div>
            <DialogDescription className="font-mono text-[11px] text-[#3d4f60] pl-4">
              {lang === "es" ? "-- nombre de la carpeta raíz del proyecto" : "-- root folder name for the project"}
            </DialogDescription>
          </DialogHeader>
          <div className="px-5 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="root-name" className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
                {lang === "es" ? "nombre de carpeta raíz" : "root folder name"}
              </Label>
              <Input
                id="root-name"
                value={exportModal?.rootName ?? ""}
                onChange={(e) => setExportModal((m) => m ? { ...m, rootName: e.target.value } : null)}
                className="bg-[#0c0e18] border-[#1c2232] focus-visible:border-[#00ff9d]/50 font-mono"
                autoFocus
              />
            </div>

            {exportModal && Object.keys(exportModal.vars).length > 0 && (
              <div className="space-y-3 border-t border-[#1c2232] pt-4">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
                  {lang === "es" ? "// variables detectadas" : "// detected variables"}
                </p>
                {Object.keys(exportModal.vars).map((token) => (
                  <div key={token} className="space-y-1">
                    <Label className="font-mono text-[10px] text-[#ffb800]/70">{token}</Label>
                    <Input
                      placeholder={token.replace(/[\[\]]/g, "")}
                      value={exportModal.vars[token]}
                      onChange={(e) =>
                        setExportModal((m) =>
                          m ? { ...m, vars: { ...m.vars, [token]: e.target.value } } : null
                        )
                      }
                      className="bg-[#0c0e18] border-[#1c2232] focus-visible:border-[#ffb800]/40 font-mono text-[#ffb800]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-5 pb-5 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setExportModal(null)}
              className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-4 py-1.5 transition-all"
            >
              {lang === "es" ? "cancelar" : "cancel"}
            </button>
            <button
              type="button"
              disabled={exportLoading || !exportModal?.rootName?.trim()}
              onClick={handleExportAction}
              className="font-mono text-[11px] border px-4 py-1.5 transition-all disabled:opacity-40"
              style={exportModal?.mode === "disk"
                ? { color: "#9d5cff", borderColor: "rgba(157,92,255,0.4)", background: "rgba(157,92,255,0.06)" }
                : { color: "#ffb800", borderColor: "rgba(255,184,0,0.4)", background: "rgba(255,184,0,0.06)" }}
            >
              {exportLoading
                ? (lang === "es" ? "procesando…" : "processing…")
                : exportModal?.mode === "disk"
                  ? (lang === "es" ? "$ elegir_ubicación" : "$ choose_location")
                  : (lang === "es" ? "$ exportar_zip" : "$ export_zip")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ─────────────────────────────────────── */}
      <Dialog open={!!templateToDelete} onOpenChange={(open) => { if (!open) setTemplateToDelete(null); }}>
        <DialogContent showCloseButton={false} className="sm:max-w-[400px] rounded-none sm:rounded-none bg-[#080a0f] border border-[#1c2232] text-[#c9d5e0] p-0 gap-0 overflow-hidden">
          <TerminalBar label="BINSTRUCT — DELETE" onClose={() => setTemplateToDelete(null)} />
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#1c2232] gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#ff4545] select-none">!</span>
              <DialogTitle className="font-mono text-[13px] font-semibold text-[#c9d5e0] tracking-wide">{T.delete_title}</DialogTitle>
            </div>
            <DialogDescription className="font-mono text-[11px] text-[#3d4f60] pl-4">{T.delete_subtitle}</DialogDescription>
          </DialogHeader>
          <div className="px-5 py-5">
            <p className="font-mono text-[12px] text-[#5a6a7a] leading-relaxed">
              {templateToDelete && T.delete_confirm(templateToDelete.name)}
            </p>
          </div>
          <div className="px-5 pb-5 flex gap-2 justify-end">
            <button type="button" onClick={() => setTemplateToDelete(null)} className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-4 py-1.5 transition-all">{T.delete_cancel}</button>
            <button type="button" onClick={handleDelete} className="font-mono text-[11px] text-[#ff4545] border border-[#ff4545]/40 bg-[#ff4545]/5 hover:bg-[#ff4545]/15 hover:border-[#ff4545]/70 px-4 py-1.5 transition-all">{T.delete_submit}</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
