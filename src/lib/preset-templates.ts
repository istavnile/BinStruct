export type PresetNode = {
  name: string;
  type: "folder" | "file";
  children?: PresetNode[];
  content?: string;
};

export type PresetTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: PresetNode;
};

export const PRESET_TEMPLATES: PresetTemplate[] = [
  // ── Audiovisual ──────────────────────────────────────────────────────────
  {
    id: "video-production",
    name: "Video Production Project",
    description: "Preproducción, cámaras, edición, VFX, color, exchange y entrega multiplataforma",
    category: "Audiovisual",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "01_PREPRODUCCION", type: "folder", children: [
          { name: "01_GUION_Y_ESCALETA", type: "folder", children: [] },
          { name: "02_STORYBOARD", type: "folder", children: [] },
          { name: "03_DESGLOSE_DE_PRODUCCION", type: "folder", children: [] },
          { name: "04_LOCACIONES", type: "folder", children: [] },
          { name: "05_LLAMADO_Y_CONTRATOS", type: "folder", children: [] },
        ]},
        { name: "02_MEDIA", type: "folder", children: [
          { name: "01_VIDEO_RAW", type: "folder", children: [
            { name: "01_A_CAM", type: "folder", children: [] },
            { name: "02_B_CAM", type: "folder", children: [] },
            { name: "03_C_CAM_DRONE", type: "folder", children: [] },
          ]},
          { name: "02_AUDIO_RAW", type: "folder", children: [] },
          { name: "03_VOICE_OVER", type: "folder", children: [] },
          { name: "04_PROXIES", type: "folder", children: [] },
          { name: "05_MUSIC", type: "folder", children: [] },
          { name: "06_SFX", type: "folder", children: [] },
          { name: "07_STOCK_FOOTAGE", type: "folder", children: [] },
          { name: "08_STOCK_IMAGES", type: "folder", children: [] },
          { name: "09_BRAND_ASSETS", type: "folder", children: [] },
        ]},
        { name: "03_PROJECT_FILES", type: "folder", children: [
          { name: "01_EDIT", type: "folder", children: [] },
          { name: "02_COLOR", type: "folder", children: [] },
          { name: "03_VFX_GFX", type: "folder", children: [] },
          { name: "04_DESIGN", type: "folder", children: [] },
        ]},
        { name: "04_DOCUMENTS", type: "folder", children: [
          { name: "01_GUION", type: "folder", children: [] },
          { name: "02_BRIEFS_Y_ESPECIFICACIONES", type: "folder", children: [] },
          { name: "03_CONTRATOS_Y_RELEASES", type: "folder", children: [] },
          { name: "04_FEEDBACK_Y_ACTAS", type: "folder", children: [] },
        ]},
        { name: "05_EXCHANGE", type: "folder", children: [
          { name: "01_XML_AAF_EDL", type: "folder", children: [] },
          { name: "02_TO_COLOR", type: "folder", children: [] },
          { name: "03_FROM_COLOR", type: "folder", children: [] },
          { name: "04_TO_VFX", type: "folder", children: [] },
          { name: "05_FROM_VFX", type: "folder", children: [] },
        ]},
        { name: "06_DELIVERY", type: "folder", children: [
          { name: "01_MASTER_LOSSLESS", type: "folder", children: [] },
          { name: "02_BROADCAST", type: "folder", children: [] },
          { name: "03_WEB_Y_STREAMING", type: "folder", children: [] },
          { name: "04_RRSS", type: "folder", children: [] },
          { name: "05_CAPTIONS_Y_SUBTITULOS", type: "folder", children: [] },
        ]},
        { name: "07_BEHIND_THE_SCENES", type: "folder", children: [] },
        { name: "08_FONTS", type: "folder", children: [] },
      ],
    },
  },
  {
    id: "produccion-eventos",
    name: "Producción de Eventos",
    description: "Brief, arte, multimedia, logística, rundown, exchange, postproducción y entrega",
    category: "Audiovisual",
    structure: {
      name: "[NOMBRE_DEL_EVENTO]",
      type: "folder",
      children: [
        { name: "01_PREPRODUCCION", type: "folder", children: [
          { name: "01_BRIEF_Y_PROPUESTA", type: "folder", children: [] },
          { name: "02_PRESUPUESTO", type: "folder", children: [] },
          { name: "03_CRONOGRAMA", type: "folder", children: [] },
          { name: "04_CONTRATOS_Y_PERMISOS", type: "folder", children: [] },
        ]},
        { name: "02_ARTE_Y_DISENO", type: "folder", children: [
          { name: "01_IDENTIDAD_VISUAL", type: "folder", children: [] },
          { name: "02_PIEZAS_IMPRESAS", type: "folder", children: [] },
          { name: "03_PIEZAS_DIGITALES", type: "folder", children: [] },
          { name: "04_SENALETICA", type: "folder", children: [] },
        ]},
        { name: "03_MULTIMEDIA", type: "folder", children: [
          { name: "01_VIDEO_RAW", type: "folder", children: [] },
          { name: "02_AUDIO_RAW", type: "folder", children: [] },
          { name: "03_FOTOGRAFIA", type: "folder", children: [] },
          { name: "04_ANIMACIONES", type: "folder", children: [] },
          { name: "05_MUSICA_Y_SFX", type: "folder", children: [] },
          { name: "06_BRAND_ASSETS", type: "folder", children: [] },
        ]},
        { name: "04_LOGISTICA", type: "folder", children: [
          { name: "01_PROVEEDORES", type: "folder", children: [] },
          { name: "02_RIDERS_TECNICOS", type: "folder", children: [] },
          { name: "03_PLANOS_Y_MAPAS", type: "folder", children: [] },
        ]},
        { name: "05_PRODUCCION", type: "folder", children: [
          { name: "01_RUNDOWN", type: "folder", children: [] },
          { name: "02_GUIONES_Y_LIBRETOS", type: "folder", children: [] },
          { name: "03_ACREDITACIONES", type: "folder", children: [] },
        ]},
        { name: "06_EXCHANGE", type: "folder", children: [
          { name: "01_PARA_PROVEEDORES", type: "folder", children: [] },
          { name: "02_DESDE_PROVEEDORES", type: "folder", children: [] },
          { name: "03_PARA_COLOR", type: "folder", children: [] },
          { name: "04_PARA_VFX", type: "folder", children: [] },
        ]},
        { name: "07_POST_PRODUCCION", type: "folder", children: [
          { name: "01_EDICION_VIDEO", type: "folder", children: [] },
          { name: "02_EDICION_FOTO", type: "folder", children: [] },
          { name: "03_INFORMES_Y_REPORTES", type: "folder", children: [] },
        ]},
        { name: "08_ENTREGA", type: "folder", children: [
          { name: "01_MASTERS", type: "folder", children: [] },
          { name: "02_REDES_Y_WEB", type: "folder", children: [] },
          { name: "03_ARCHIVO", type: "folder", children: [] },
        ]},
        { name: "09_FONTS", type: "folder", children: [] },
      ],
    },
  },
  {
    id: "podcast",
    name: "Podcast",
    description: "Arte, música, episodios (raw → edición → entrega), entrevistados y distribución",
    category: "Audiovisual",
    structure: {
      name: "[NOMBRE_DEL_PODCAST]",
      type: "folder",
      children: [
        { name: "01_ARTE_Y_BRANDING", type: "folder", children: [
          { name: "01_COVER_ART", type: "folder", children: [] },
          { name: "02_THUMBNAILS_POR_EPISODIO", type: "folder", children: [] },
          { name: "03_ASSETS_REDES_SOCIALES", type: "folder", children: [] },
        ]},
        { name: "02_MUSICA_Y_SFX", type: "folder", children: [
          { name: "01_INTRO_OUTRO", type: "folder", children: [] },
          { name: "02_CAMAS_MUSICALES", type: "folder", children: [] },
          { name: "03_SFX", type: "folder", children: [] },
        ]},
        { name: "03_EPISODIOS", type: "folder", children: [
          { name: "EP001", type: "folder", children: [
            { name: "01_AUDIO_RAW", type: "folder", children: [] },
            { name: "02_GUION_Y_NOTAS", type: "folder", children: [] },
            { name: "03_EDICION", type: "folder", children: [] },
            { name: "04_ENTREGA", type: "folder", children: [] },
          ]},
        ]},
        { name: "04_ENTREVISTADOS", type: "folder", children: [
          { name: "01_RELEASES_Y_CONTRATOS", type: "folder", children: [] },
          { name: "02_BIOS_Y_FOTOS", type: "folder", children: [] },
        ]},
        { name: "05_DISTRIBUCION", type: "folder", children: [
          { name: "01_RSS_Y_PLATAFORMAS", type: "folder", children: [] },
          { name: "02_SHOW_NOTES", type: "folder", children: [] },
          { name: "03_TRANSCRIPCIONES", type: "folder", children: [] },
        ]},
        { name: "06_MASTERS", type: "folder", children: [] },
      ],
    },
  },
  {
    id: "fotografia-comercial",
    name: "Fotografía Comercial",
    description: "Preproducción, captura RAW, selección, retoque, entrega por formato y behind the scenes",
    category: "Audiovisual",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "01_PREPRODUCCION", type: "folder", children: [
          { name: "01_BRIEF", type: "folder", children: [] },
          { name: "02_MOODBOARD", type: "folder", children: [] },
          { name: "03_LOCACIONES", type: "folder", children: [] },
          { name: "04_LLAMADO_Y_CREW", type: "folder", children: [] },
        ]},
        { name: "02_CAPTURA", type: "folder", children: [
          { name: "01_RAW", type: "folder", children: [] },
          { name: "02_TETHERING", type: "folder", children: [] },
        ]},
        { name: "03_SELECCION", type: "folder", children: [
          { name: "01_SELECTS_PRIMERA_VUELTA", type: "folder", children: [] },
          { name: "02_APROBADOS_CLIENTE", type: "folder", children: [] },
        ]},
        { name: "04_RETOQUE", type: "folder", children: [
          { name: "01_WIP", type: "folder", children: [] },
          { name: "02_PARA_REVISION", type: "folder", children: [] },
          { name: "03_APROBADOS", type: "folder", children: [] },
        ]},
        { name: "05_ENTREGA", type: "folder", children: [
          { name: "01_WEB_RRSS", type: "folder", children: [] },
          { name: "02_IMPRENTA", type: "folder", children: [] },
          { name: "03_MASTERS_FULL_RES", type: "folder", children: [] },
        ]},
        { name: "06_CLIENTE", type: "folder", children: [
          { name: "01_ASSETS_RECIBIDOS", type: "folder", children: [] },
          { name: "02_FEEDBACK", type: "folder", children: [] },
        ]},
        { name: "07_BEHIND_THE_SCENES", type: "folder", children: [] },
      ],
    },
  },
  {
    id: "animacion-motion",
    name: "Animación y Motion Graphics",
    description: "Concept, storyboard, assets, project files AE/C4D, render, compositing y entrega",
    category: "Audiovisual",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "01_PREPRODUCCION", type: "folder", children: [
          { name: "01_BRIEF_Y_CONCEPTO", type: "folder", children: [] },
          { name: "02_STORYBOARD", type: "folder", children: [] },
          { name: "03_ANIMATIC", type: "folder", children: [] },
          { name: "04_STYLEFRAME", type: "folder", children: [] },
        ]},
        { name: "02_ASSETS", type: "folder", children: [
          { name: "01_ILUSTRACIONES", type: "folder", children: [] },
          { name: "02_BRAND_ASSETS", type: "folder", children: [] },
          { name: "03_TIPOGRAFIA", type: "folder", children: [] },
          { name: "04_TEXTURAS_Y_FONDOS", type: "folder", children: [] },
          { name: "05_VIDEO_RAW", type: "folder", children: [] },
          { name: "06_MUSICA_Y_SFX", type: "folder", children: [] },
        ]},
        { name: "03_PRODUCCION", type: "folder", children: [
          { name: "01_PROJECT_FILES_AE_C4D", type: "folder", children: [] },
          { name: "02_PROXIES", type: "folder", children: [] },
        ]},
        { name: "04_RENDER", type: "folder", children: [
          { name: "01_SECUENCIAS", type: "folder", children: [] },
          { name: "02_PREVIEWS", type: "folder", children: [] },
          { name: "03_LOSSLESS_MASTERS", type: "folder", children: [] },
        ]},
        { name: "05_COMPOSITING", type: "folder", children: [
          { name: "01_PROJECT_FILES", type: "folder", children: [] },
          { name: "02_VFX", type: "folder", children: [] },
        ]},
        { name: "06_ENTREGA", type: "folder", children: [
          { name: "01_MASTERS", type: "folder", children: [] },
          { name: "02_COMPRIMIDOS", type: "folder", children: [] },
          { name: "03_GIF_Y_WEB", type: "folder", children: [] },
        ]},
        { name: "07_FONTS", type: "folder", children: [] },
      ],
    },
  },
  {
    id: "produccion-musical",
    name: "Producción Musical",
    description: "Preproducción, tracking por instrumento, DAW, stems, mezcla, mastering y distribución",
    category: "Audiovisual",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "01_PREPRODUCCION", type: "folder", children: [
          { name: "01_DEMOS_Y_REFERENCIAS", type: "folder", children: [] },
          { name: "02_LETRAS_Y_CHARTS", type: "folder", children: [] },
          { name: "03_CONTRATOS", type: "folder", children: [] },
        ]},
        { name: "02_TRACKING", type: "folder", children: [
          { name: "01_BATERIAS", type: "folder", children: [] },
          { name: "02_BAJOS_Y_GUITARRAS", type: "folder", children: [] },
          { name: "03_TECLADOS_Y_SINTETIZADORES", type: "folder", children: [] },
          { name: "04_VOCES", type: "folder", children: [] },
          { name: "05_ADICIONALES", type: "folder", children: [] },
        ]},
        { name: "03_PROYECTO_DAW", type: "folder", children: [
          { name: "01_SESSION_FILES", type: "folder", children: [] },
          { name: "02_PLUGINS_Y_PRESETS", type: "folder", children: [] },
          { name: "03_SAMPLES", type: "folder", children: [] },
        ]},
        { name: "04_EDICION_Y_MEZCLA", type: "folder", children: [
          { name: "01_STEMS", type: "folder", children: [] },
          { name: "02_BOUNCE_REVISIONES", type: "folder", children: [] },
          { name: "03_MIX_FINAL", type: "folder", children: [] },
        ]},
        { name: "05_MASTERING", type: "folder", children: [
          { name: "01_PARA_MASTERING", type: "folder", children: [] },
          { name: "02_MASTERS_FINALES", type: "folder", children: [] },
          { name: "03_MASTERS_STREAMING", type: "folder", children: [] },
        ]},
        { name: "06_ARTE_Y_VISUAL", type: "folder", children: [
          { name: "01_COVER_ART", type: "folder", children: [] },
          { name: "02_LYRIC_VIDEO", type: "folder", children: [] },
          { name: "03_VIDEO_CLIP", type: "folder", children: [] },
          { name: "04_PROMO_RRSS", type: "folder", children: [] },
        ]},
        { name: "07_DISTRIBUCION", type: "folder", children: [
          { name: "01_PLATAFORMAS_DIGITALES", type: "folder", children: [] },
          { name: "02_PRENSA_Y_MEDIOS", type: "folder", children: [] },
          { name: "03_METADATA", type: "folder", children: [] },
        ]},
      ],
    },
  },

  // ── Diseño ───────────────────────────────────────────────────────────────
  {
    id: "branding",
    name: "Branding y Creación de Marca",
    description: "Brief, investigación, diseño del logo, sistema de marca, brand guidelines y entrega",
    category: "Diseño",
    structure: {
      name: "[NOMBRE_DE_LA_MARCA]",
      type: "folder",
      children: [
        { name: "01_BRIEF_Y_ESTRATEGIA", type: "folder", children: [
          { name: "01_BRIEF_DEL_CLIENTE", type: "folder", children: [] },
          { name: "02_INVESTIGACION_Y_BENCHMARKING", type: "folder", children: [] },
          { name: "03_MOODBOARD", type: "folder", children: [] },
          { name: "04_ESTRATEGIA_DE_MARCA", type: "folder", children: [] },
        ]},
        { name: "02_DISENO", type: "folder", children: [
          { name: "01_BOCETOS_Y_SKETCHES", type: "folder", children: [] },
          { name: "02_EXPLORACION_LOGOMARK", type: "folder", children: [] },
          { name: "03_PROPUESTAS_FINALES", type: "folder", children: [] },
          { name: "04_REVISIONES", type: "folder", children: [] },
        ]},
        { name: "03_IDENTIDAD_VISUAL", type: "folder", children: [
          { name: "01_LOGO_PRINCIPAL", type: "folder", children: [] },
          { name: "02_VARIACIONES_DE_LOGO", type: "folder", children: [] },
          { name: "03_PALETA_DE_COLORES", type: "folder", children: [] },
          { name: "04_TIPOGRAFIA", type: "folder", children: [] },
          { name: "05_ICONOGRAFIA", type: "folder", children: [] },
          { name: "06_PATRON_Y_TEXTURAS", type: "folder", children: [] },
        ]},
        { name: "04_SISTEMA_DE_MARCA", type: "folder", children: [
          { name: "01_PAPELERIA", type: "folder", children: [] },
          { name: "02_PIEZAS_DIGITALES", type: "folder", children: [] },
          { name: "03_SENALETICA_Y_AMBIENTAL", type: "folder", children: [] },
          { name: "04_MERCHANDISING", type: "folder", children: [] },
          { name: "05_MOCKUPS", type: "folder", children: [] },
        ]},
        { name: "05_BRAND_GUIDELINES", type: "folder", children: [
          { name: "01_MANUAL_DE_MARCA_WIP", type: "folder", children: [] },
          { name: "02_MANUAL_DE_MARCA_FINAL", type: "folder", children: [] },
        ]},
        { name: "06_ARCHIVOS_FUENTE", type: "folder", children: [
          { name: "01_AI_EPS", type: "folder", children: [] },
          { name: "02_PSD", type: "folder", children: [] },
          { name: "03_FIGMA_SKETCH", type: "folder", children: [] },
        ]},
        { name: "07_ENTREGA", type: "folder", children: [
          { name: "01_LOGOS_SVG_PNG_PDF", type: "folder", children: [] },
          { name: "02_FUENTES_LICENCIADAS", type: "folder", children: [] },
          { name: "03_PIEZAS_FINALES", type: "folder", children: [] },
          { name: "04_PRESENTACION_AL_CLIENTE", type: "folder", children: [] },
        ]},
        { name: "08_CLIENTE", type: "folder", children: [
          { name: "01_ASSETS_RECIBIDOS", type: "folder", children: [] },
          { name: "02_FEEDBACK_Y_APROBACIONES", type: "folder", children: [] },
        ]},
      ],
    },
  },
  {
    id: "diseno-editorial",
    name: "Diseño Editorial",
    description: "Textos, imágenes, maquetación, preprensa, versión digital y archivos para imprenta",
    category: "Diseño",
    structure: {
      name: "[NOMBRE_DE_LA_PUBLICACION]",
      type: "folder",
      children: [
        { name: "01_BRIEF_Y_PLANIFICACION", type: "folder", children: [
          { name: "01_BRIEF", type: "folder", children: [] },
          { name: "02_INDICE_Y_ESTRUCTURA", type: "folder", children: [] },
          { name: "03_CRONOGRAMA", type: "folder", children: [] },
        ]},
        { name: "02_CONTENIDO", type: "folder", children: [
          { name: "01_TEXTOS_Y_COPYS", type: "folder", children: [] },
          { name: "02_IMAGENES_RAW", type: "folder", children: [] },
          { name: "03_ILUSTRACIONES", type: "folder", children: [] },
          { name: "04_INFOGRAFIAS", type: "folder", children: [] },
        ]},
        { name: "03_DISENO", type: "folder", children: [
          { name: "01_IDENTIDAD_Y_ESTILO", type: "folder", children: [] },
          { name: "02_MAQUETACION_WIP", type: "folder", children: [] },
          { name: "03_PARA_REVISION", type: "folder", children: [] },
          { name: "04_APROBADOS", type: "folder", children: [] },
        ]},
        { name: "04_PREPRENSA", type: "folder", children: [
          { name: "01_PDF_PREFLIGHT", type: "folder", children: [] },
          { name: "02_IMPOSICION", type: "folder", children: [] },
          { name: "03_PRUEBAS_DE_COLOR", type: "folder", children: [] },
        ]},
        { name: "05_DIGITAL", type: "folder", children: [
          { name: "01_EPUB_PDF_INTERACTIVO", type: "folder", children: [] },
          { name: "02_RRSS_Y_WEB", type: "folder", children: [] },
        ]},
        { name: "06_ENTREGA", type: "folder", children: [
          { name: "01_ARCHIVOS_IMPRENTA", type: "folder", children: [] },
          { name: "02_DIGITAL_FINAL", type: "folder", children: [] },
          { name: "03_ARCHIVOS_FUENTE", type: "folder", children: [] },
        ]},
        { name: "07_FONTS", type: "folder", children: [] },
      ],
    },
  },
  {
    id: "ux-ui",
    name: "UX/UI de Producto Digital",
    description: "Research, arquitectura, wireframes, UI, design system, prototipo y handoff a desarrollo",
    category: "Diseño",
    structure: {
      name: "[NOMBRE_DEL_PRODUCTO]",
      type: "folder",
      children: [
        { name: "01_DISCOVERY_Y_RESEARCH", type: "folder", children: [
          { name: "01_BRIEF_Y_OBJETIVOS", type: "folder", children: [] },
          { name: "02_BENCHMARK_COMPETENCIA", type: "folder", children: [] },
          { name: "03_USER_RESEARCH", type: "folder", children: [] },
          { name: "04_PERSONAS_Y_JOURNEY", type: "folder", children: [] },
        ]},
        { name: "02_ARQUITECTURA_Y_FLUJOS", type: "folder", children: [
          { name: "01_SITEMAP_Y_FLUJOS", type: "folder", children: [] },
          { name: "02_WIREFRAMES_LO_FI", type: "folder", children: [] },
        ]},
        { name: "03_DISENO_UI", type: "folder", children: [
          { name: "01_MOODBOARD_Y_STYLESCAPE", type: "folder", children: [] },
          { name: "02_COMPONENTES", type: "folder", children: [] },
          { name: "03_PANTALLAS_WIP", type: "folder", children: [] },
          { name: "04_PARA_REVISION", type: "folder", children: [] },
          { name: "05_APROBADOS", type: "folder", children: [] },
        ]},
        { name: "04_PROTOTIPO", type: "folder", children: [
          { name: "01_PROTOTIPOS_FIGMA", type: "folder", children: [] },
          { name: "02_VIDEOS_DE_DEMO", type: "folder", children: [] },
        ]},
        { name: "05_DESIGN_SYSTEM", type: "folder", children: [
          { name: "01_TOKENS", type: "folder", children: [] },
          { name: "02_COMPONENTES", type: "folder", children: [] },
          { name: "03_DOCUMENTACION", type: "folder", children: [] },
        ]},
        { name: "06_HANDOFF_DESARROLLO", type: "folder", children: [
          { name: "01_SPECS_Y_ANOTACIONES", type: "folder", children: [] },
          { name: "02_ASSETS_EXPORTADOS", type: "folder", children: [] },
          { name: "03_ICONOS_SVG", type: "folder", children: [] },
        ]},
        { name: "07_CLIENTE", type: "folder", children: [
          { name: "01_ASSETS_RECIBIDOS", type: "folder", children: [] },
          { name: "02_FEEDBACK_Y_ACTAS", type: "folder", children: [] },
        ]},
        { name: "08_FONTS", type: "folder", children: [] },
      ],
    },
  },
  {
    id: "campana-publicitaria",
    name: "Campaña Publicitaria",
    description: "Estrategia, key visual, producción AV, piezas digitales, OOH y reportes de resultados",
    category: "Diseño",
    structure: {
      name: "[NOMBRE_DE_LA_CAMPANA]",
      type: "folder",
      children: [
        { name: "01_ESTRATEGIA", type: "folder", children: [
          { name: "01_BRIEF_CREATIVO", type: "folder", children: [] },
          { name: "02_CONCEPTO_Y_CLAIM", type: "folder", children: [] },
          { name: "03_PLAN_DE_MEDIOS", type: "folder", children: [] },
          { name: "04_CRONOGRAMA", type: "folder", children: [] },
        ]},
        { name: "02_IDENTIDAD_CAMPANA", type: "folder", children: [
          { name: "01_MOODBOARD", type: "folder", children: [] },
          { name: "02_BRAND_ASSETS", type: "folder", children: [] },
          { name: "03_KEY_VISUAL", type: "folder", children: [] },
        ]},
        { name: "03_PRODUCCION", type: "folder", children: [
          { name: "01_VIDEO_Y_TV", type: "folder", children: [] },
          { name: "02_RADIO_Y_AUDIO", type: "folder", children: [] },
          { name: "03_FOTOGRAFIA", type: "folder", children: [] },
        ]},
        { name: "04_PIEZAS_DIGITALES", type: "folder", children: [
          { name: "01_REDES_SOCIALES", type: "folder", children: [] },
          { name: "02_DISPLAY_Y_BANNERS", type: "folder", children: [] },
          { name: "03_EMAIL_MARKETING", type: "folder", children: [] },
          { name: "04_WEB_Y_LANDING", type: "folder", children: [] },
        ]},
        { name: "05_PIEZAS_OOH", type: "folder", children: [
          { name: "01_VALLAS_Y_PANELES", type: "folder", children: [] },
          { name: "02_VIA_PUBLICA", type: "folder", children: [] },
          { name: "03_PUNTO_DE_VENTA", type: "folder", children: [] },
        ]},
        { name: "06_ENTREGA", type: "folder", children: [
          { name: "01_ARCHIVOS_FINALES", type: "folder", children: [] },
          { name: "02_PARA_MEDIOS", type: "folder", children: [] },
        ]},
        { name: "07_REPORTES_Y_METRICAS", type: "folder", children: [] },
        { name: "08_FONTS", type: "folder", children: [] },
      ],
    },
  },

  // ── Arquitectura ─────────────────────────────────────────────────────────
  {
    id: "arquitectura-interiorismo",
    name: "Arquitectura e Interiorismo",
    description: "Levantamiento, anteproyecto, planos ejecutivos, renders 3D, materiales, obra y entrega",
    category: "Arquitectura",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "01_BRIEF_Y_LEVANTAMIENTO", type: "folder", children: [
          { name: "01_BRIEF_DEL_CLIENTE", type: "folder", children: [] },
          { name: "02_FOTOS_LEVANTAMIENTO", type: "folder", children: [] },
          { name: "03_MEDICIONES", type: "folder", children: [] },
        ]},
        { name: "02_ANTEPROYECTO", type: "folder", children: [
          { name: "01_BOCETOS_Y_CONCEPTOS", type: "folder", children: [] },
          { name: "02_PLANTAS_Y_CORTES", type: "folder", children: [] },
          { name: "03_MOODBOARD", type: "folder", children: [] },
        ]},
        { name: "03_PROYECTO_EJECUTIVO", type: "folder", children: [
          { name: "01_PLANOS_ARQUITECTONICOS", type: "folder", children: [] },
          { name: "02_PLANOS_TECNICOS", type: "folder", children: [] },
          { name: "03_DETALLES_CONSTRUCTIVOS", type: "folder", children: [] },
          { name: "04_ESPECIFICACIONES", type: "folder", children: [] },
        ]},
        { name: "04_RENDERS_Y_VISUALIZACION", type: "folder", children: [
          { name: "01_MODELOS_3D", type: "folder", children: [] },
          { name: "02_RENDERS_WIP", type: "folder", children: [] },
          { name: "03_RENDERS_FINALES", type: "folder", children: [] },
          { name: "04_RECORRIDO_VIRTUAL", type: "folder", children: [] },
        ]},
        { name: "05_MATERIALES_Y_ACABADOS", type: "folder", children: [
          { name: "01_PALETA_MATERIALES", type: "folder", children: [] },
          { name: "02_FICHAS_TECNICAS", type: "folder", children: [] },
          { name: "03_MUESTRAS_Y_REFERENCIAS", type: "folder", children: [] },
        ]},
        { name: "06_PRESUPUESTO_Y_PROVEEDORES", type: "folder", children: [
          { name: "01_COTIZACIONES", type: "folder", children: [] },
          { name: "02_CONTRATOS", type: "folder", children: [] },
        ]},
        { name: "07_OBRA", type: "folder", children: [
          { name: "01_REGISTRO_FOTOGRAFICO", type: "folder", children: [] },
          { name: "02_ACTAS_DE_OBRA", type: "folder", children: [] },
        ]},
        { name: "08_ENTREGA", type: "folder", children: [
          { name: "01_PLANOS_AS_BUILT", type: "folder", children: [] },
          { name: "02_FOTOGRAFIA_FINAL", type: "folder", children: [] },
          { name: "03_DOCUMENTACION_COMPLETA", type: "folder", children: [] },
        ]},
      ],
    },
  },

  // ── Desarrollo ───────────────────────────────────────────────────────────
  {
    id: "nextjs-app",
    name: "Next.js App (App Router)",
    description: "Estructura para aplicaciones Next.js con App Router: src, components, lib, API y prisma",
    category: "Desarrollo",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "src", type: "folder", children: [
          { name: "app", type: "folder", children: [
            { name: "(app)", type: "folder", children: [] },
            { name: "api", type: "folder", children: [] },
            { name: "login", type: "folder", children: [] },
          ]},
          { name: "components", type: "folder", children: [
            { name: "ui", type: "folder", children: [] },
          ]},
          { name: "lib", type: "folder", children: [] },
          { name: "actions", type: "folder", children: [] },
          { name: "middleware.ts", type: "file", content: "" },
        ]},
        { name: "prisma", type: "folder", children: [
          { name: "migrations", type: "folder", children: [] },
          { name: "schema.prisma", type: "file", content: "" },
          { name: "seed.ts", type: "file", content: "" },
        ]},
        { name: "public", type: "folder", children: [] },
        { name: ".env.example", type: "file", content: "" },
        { name: "next.config.mjs", type: "file", content: "" },
        { name: "tailwind.config.ts", type: "file", content: "" },
        { name: "tsconfig.json", type: "file", content: "" },
      ],
    },
  },
  {
    id: "python-fastapi",
    name: "Python FastAPI",
    description: "Estructura para APIs con FastAPI: routers, schemas, modelos, servicios y tests",
    category: "Desarrollo",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "app", type: "folder", children: [
          { name: "routers", type: "folder", children: [] },
          { name: "models", type: "folder", children: [] },
          { name: "schemas", type: "folder", children: [] },
          { name: "services", type: "folder", children: [] },
          { name: "core", type: "folder", children: [] },
          { name: "main.py", type: "file", content: "" },
        ]},
        { name: "tests", type: "folder", children: [] },
        { name: "alembic", type: "folder", children: [] },
        { name: ".env.example", type: "file", content: "" },
        { name: "requirements.txt", type: "file", content: "" },
        { name: "README.md", type: "file", content: "" },
      ],
    },
  },
  {
    id: "nodejs-rest-api",
    name: "Node.js REST API",
    description: "Estructura para APIs REST con Node.js: routes, controllers, services, middleware y tests",
    category: "Desarrollo",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        { name: "src", type: "folder", children: [
          { name: "routes", type: "folder", children: [] },
          { name: "controllers", type: "folder", children: [] },
          { name: "services", type: "folder", children: [] },
          { name: "middleware", type: "folder", children: [] },
          { name: "models", type: "folder", children: [] },
          { name: "utils", type: "folder", children: [] },
          { name: "config", type: "folder", children: [] },
          { name: "index.ts", type: "file", content: "" },
        ]},
        { name: "tests", type: "folder", children: [] },
        { name: ".env.example", type: "file", content: "" },
        { name: "package.json", type: "file", content: "" },
        { name: "tsconfig.json", type: "file", content: "" },
      ],
    },
  },
  {
    id: "monorepo-turborepo",
    name: "Monorepo (Turborepo)",
    description: "Monorepo con Turborepo: apps web/mobile, packages compartidos, UI y configuración",
    category: "Desarrollo",
    structure: {
      name: "[NOMBRE_DEL_MONOREPO]",
      type: "folder",
      children: [
        { name: "apps", type: "folder", children: [
          { name: "web", type: "folder", children: [] },
          { name: "mobile", type: "folder", children: [] },
          { name: "docs", type: "folder", children: [] },
        ]},
        { name: "packages", type: "folder", children: [
          { name: "ui", type: "folder", children: [] },
          { name: "config-eslint", type: "folder", children: [] },
          { name: "config-typescript", type: "folder", children: [] },
          { name: "utils", type: "folder", children: [] },
        ]},
        { name: "turbo.json", type: "file", content: "" },
        { name: "package.json", type: "file", content: "" },
        { name: "pnpm-workspace.yaml", type: "file", content: "" },
      ],
    },
  },
];

export const PRESET_CATEGORIES = Array.from(new Set(PRESET_TEMPLATES.map((t) => t.category)));
