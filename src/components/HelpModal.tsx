"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  LayoutTemplate, FolderTree, Variable, FileArchive,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import type { Lang } from "@/lib/lang";

const STORAGE_KEY = "binstruct:onboarding-done";

/* ── Step definitions ──────────────────────────────────────────────────── */
const STEPS_ES = [
  {
    icon: LayoutTemplate,
    iconColor: "#00ff9d",
    title: "Bienvenido a BinStruct",
    subtitle: "Gestiona plantillas de carpetas para producción",
    preview: `> plantillas
-- administra tus estructuras de carpetas

  ┌─ NOMBRE ──────────────────── ACCIONES ─┐
  │ Video Production Project       ✎ ⬇ ⊡  │
  │ Canal YouTube                  ✎ ⬇ ⊡  │
  └────────────────────────────────────────┘

$ + nueva_plantilla`,
    body: "BinStruct te permite crear, organizar y exportar estructuras de carpetas para tus proyectos audiovisuales. Puedes partir de una plantilla predefinida o construir la tuya desde cero.",
  },
  {
    icon: FolderTree,
    iconColor: "#00d4ff",
    title: "Editor de árbol",
    subtitle: "Construye la estructura de tu proyecto",
    preview: `// ESTRUCTURA          │ // editando: 01_MEDIA
──────────────────────┤──────────────────────
∨ □ Mi_Proyecto       │
  ∨ □ 01_MEDIA  ←     │  NOMBRE
      □ 01_VIDEO_RAW  │  ┌─────────────────┐
      □ 02_AUDIO_RAW  │  │ 01_MEDIA        │
  > □ 02_POST         │  └─────────────────┘
  > □ 03_DOCUMENTS    │
                      │  □ + archivo
                      │  □ + carpeta`,
    body: "Haz clic en cualquier nodo para editarlo. Usa los botones + para agregar carpetas y archivos. Arrastra el borde entre paneles para ajustar el ancho del árbol.",
  },
  {
    icon: Variable,
    iconColor: "#ffb800",
    title: "Variables dinámicas",
    subtitle: "Plantillas que se adaptan a cada proyecto",
    preview: `// define variables en los nombres:

  □ [NOMBRE_DEL_PROYECTO]
    □ 01_[CLIENTE]_MEDIA
    □ 02_POST
    □ 03_[AÑO]_DOCUMENTOS

// al exportar, BinStruct pregunta:

  $ valor para [NOMBRE_DEL_PROYECTO]:
  ┌───────────────────────────┐
  │ Documental_Oveja_2024_    │
  └───────────────────────────┘`,
    body: "Escribe tokens como [NOMBRE] o [CLIENTE] en los nombres de carpetas. Al exportar, la app los detecta automáticamente y te pide el valor para reemplazarlos.",
  },
  {
    icon: FileArchive,
    iconColor: "#9d5cff",
    title: "Exportar",
    subtitle: "Tres formas de sacar tu estructura",
    preview: `┌──────────────────────────────────────┐
│  ⬇  export_json   → respaldo/JSON    │
│  ⊡  en_disco      → carpetas reales  │
│  ⊞  export_zip    → archivo .zip     │
└──────────────────────────────────────┘

// en_disco usa la File System API
// del navegador — compatible con
// Chrome, Edge y Safari.

$ elige una ubicación y listo.`,
    body: "Exporta como ZIP para compartir, escribe directamente al disco para empezar a trabajar de inmediato, o guarda en JSON para respaldar o importar en otro equipo.",
  },
];

const STEPS_EN = [
  {
    icon: LayoutTemplate,
    iconColor: "#00ff9d",
    title: "Welcome to BinStruct",
    subtitle: "Manage folder templates for production",
    preview: STEPS_ES[0].preview,
    body: "BinStruct lets you create, organize and export folder structures for your audiovisual projects. Start from a preset template or build your own from scratch.",
  },
  {
    icon: FolderTree,
    iconColor: "#00d4ff",
    title: "Tree editor",
    subtitle: "Build your project structure",
    preview: STEPS_ES[1].preview,
    body: "Click any node to edit it. Use the + buttons to add folders and files. Drag the panel divider to resize the tree width.",
  },
  {
    icon: Variable,
    iconColor: "#ffb800",
    title: "Dynamic variables",
    subtitle: "Templates that adapt to each project",
    preview: STEPS_ES[2].preview,
    body: "Write tokens like [NAME] or [CLIENT] in folder names. When exporting, the app detects them automatically and asks you for the replacement value.",
  },
  {
    icon: FileArchive,
    iconColor: "#9d5cff",
    title: "Export",
    subtitle: "Three ways to get your structure out",
    preview: STEPS_ES[3].preview,
    body: "Export as ZIP to share, write directly to disk to start working immediately, or save as JSON to back up or import on another machine.",
  },
];

/* ── Component ─────────────────────────────────────────────────────────── */
export function HelpModal({ open, onOpenChange, lang = "es" }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lang?: Lang;
}) {
  const [step, setStep] = useState(0);
  const steps = lang === "en" ? STEPS_EN : STEPS_ES;
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  // Reset to step 0 every time the modal opens
  useEffect(() => { if (open) setStep(0); }, [open]);

  const close = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[560px] rounded-none sm:rounded-none bg-[#080a0f] border border-[#1c2232] text-[#c9d5e0] p-0 gap-0 overflow-hidden"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-[#1c2232] px-4 py-2.5 bg-[#080a0f] shrink-0">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={close}
              className="h-2.5 w-2.5 rounded-full bg-[#ff4545]/70 hover:bg-[#ff4545] transition-colors"
            />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffb800]/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00ff9d]/50" />
          </div>
          <span className="font-mono text-[10px] text-[#3d4f60] tracking-[0.15em] mx-auto select-none">
            BINSTRUCT — AYUDA
          </span>
        </div>

        {/* Step content */}
        <div className="flex flex-col p-6 gap-5">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center border"
              style={{ borderColor: `${current.iconColor}30`, backgroundColor: `${current.iconColor}0d` }}
            >
              <Icon size={18} style={{ color: current.iconColor }} />
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: `${current.iconColor}80` }}>
                paso {step + 1} / {steps.length}
              </p>
              <h2 className="font-mono text-[15px] font-semibold text-[#c9d5e0] leading-tight">{current.title}</h2>
              <p className="font-mono text-[11px] text-[#3d4f60] mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          {/* Terminal preview */}
          <div className="bg-[#0c0e18] border border-[#1c2232] p-4 overflow-x-auto">
            <pre className="font-mono text-[10px] leading-[1.7] text-[#5a7080] whitespace-pre">
              {current.preview}
            </pre>
          </div>

          {/* Body text */}
          <p className="font-mono text-[12px] text-[#7a8a9a] leading-relaxed">{current.body}</p>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1c2232] px-6 py-4 flex items-center justify-between shrink-0">
          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 20 : 6,
                  backgroundColor: i === step ? current.iconColor : "#1c2232",
                }}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-3 py-1.5 flex items-center gap-1 transition-all"
              >
                <ChevronLeft size={11} /> anterior
              </button>
            )}
            {isLast ? (
              <button
                onClick={close}
                className="font-mono text-[11px] text-[#00ff9d] border border-[#00ff9d]/40 bg-[#00ff9d]/8 hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 px-4 py-1.5 flex items-center gap-1.5 transition-all"
              >
                $ entendido
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="font-mono text-[11px] text-[#c9d5e0] border border-[#1c2232] hover:border-[#3d4f60] px-3 py-1.5 flex items-center gap-1 transition-all"
              >
                siguiente <ChevronRight size={11} />
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Hook: auto-show on first visit ────────────────────────────────────── */
export function useHelpAutoOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {}
  }, []);
  return [open, setOpen] as const;
}
