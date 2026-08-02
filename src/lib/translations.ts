export type Lang = "es" | "en";

const t = {
  es: {
    // Nav
    nav_templates: "Templates",
    nav_settings: "Settings",
    nav_logout: "$ logout",

    // Templates page
    tpl_title: "plantillas",
    tpl_subtitle: "-- administra tus estructuras de carpetas",
    tpl_new: "nueva_plantilla",
    tpl_col_name: "Nombre",
    tpl_col_desc: "Descripción",
    tpl_col_updated: "Actualizado",
    tpl_col_actions: "Acciones",
    tpl_empty: "// no hay templates · crea el primero",
    tpl_edit: "Editar Estructura",
    tpl_export: "Exportar a ZIP",
    tpl_delete: "Eliminar",

    // Picker
    picker_title: "elige_punto_de_partida",
    picker_subtitle: "-- selecciona una plantilla o empieza desde cero",
    picker_blank_name: "desde_cero",
    picker_blank_desc: "Carpeta raíz vacía · construye libremente",
    picker_cancel: "[esc] cancelar",

    // Create dialog
    create_title_preset: "confirmar_template",
    create_title_blank: "nuevo_template",
    create_label_name: "nombre",
    create_label_desc: "descripción",
    create_desc_optional: "// opcional",
    create_back: "← atrás",
    create_submit: "$ crear_template",
    create_creating: "creando…",

    // Delete dialog
    delete_title: "eliminar_template",
    delete_subtitle: "-- esta acción no se puede deshacer",
    delete_confirm: (name: string) => `¿Confirmas la eliminación de "${name}"?`,
    delete_cancel: "cancelar",
    delete_submit: "$ eliminar",

    // Settings
    settings_title: "settings",
    settings_subtitle: "-- workspace configuration",
    settings_name: "name",
    settings_workspace_id: "workspace_id",
    settings_role: "role",
    settings_lang_section: "// IDIOMA",
    settings_lang_hint: "-- idioma de la interfaz",
    settings_api_new: "nueva key",
    settings_api_creating: "generando…",
    settings_api_empty: "// no hay API keys · usa el botón para generar una",
    settings_api_footer: "// guarda tu key en un lugar seguro · se muestra completa solo al crearla",
    settings_api_copy: "Copiar",
    settings_api_delete: "Eliminar",

    // Login
    login_subtitle: "template management",
    login_prompt_signin: "> ingresa tus credenciales para continuar",
    login_prompt_signup: "> crea tu cuenta y workspace",
    login_label_name: "nombre",
    login_label_email: "email",
    login_label_password: "contraseña",
    login_label_confirm: "confirmar contraseña",
    login_pw_hint: "// mín. 8 caracteres",
    login_forgot: "¿olvidaste?",
    login_err_credentials: "Email o contraseña incorrectos.",
    login_err_mismatch: "Las contraseñas no coinciden.",
    login_err_register: "Error al crear la cuenta.",
    login_err_generic: "Algo salió mal.",
    login_success_created: "¡Cuenta creada! Iniciando sesión…",
    login_err_login_after: "Cuenta creada, pero no se pudo iniciar sesión.",
    login_footer: "BINSTRUCT · OPEN SOURCE · MIT",

    // Builder
    builder_back: "templates",
    builder_disk: "en_disco",
    builder_zip: "export_zip",
    builder_save: "$ guardar",
    builder_saving: "guardando…",
    builder_structure: "// ESTRUCTURA",
    builder_editing: "// editando:",
    builder_name: "nombre",
    builder_content: "contenido",
    builder_add_file: "+ archivo",
    builder_add_folder: "+ carpeta",
    builder_select_hint: "// selecciona un nodo para editar",
    builder_disk_title: "crear_en_disco",
    builder_disk_subtitle: "-- elige una ubicación y el navegador creará las carpetas",
    builder_disk_cancel: "cancelar",
    builder_disk_submit: "$ elegir_ubicación",
  },
  en: {
    // Nav
    nav_templates: "Templates",
    nav_settings: "Settings",
    nav_logout: "$ logout",

    // Templates page
    tpl_title: "templates",
    tpl_subtitle: "-- manage your folder structures",
    tpl_new: "new_template",
    tpl_col_name: "Name",
    tpl_col_desc: "Description",
    tpl_col_updated: "Updated",
    tpl_col_actions: "Actions",
    tpl_empty: "// no templates yet · create the first one",
    tpl_edit: "Edit Structure",
    tpl_export: "Export as ZIP",
    tpl_delete: "Delete",

    // Picker
    picker_title: "choose_starting_point",
    picker_subtitle: "-- select a template or start from scratch",
    picker_blank_name: "from_scratch",
    picker_blank_desc: "Empty root folder · build the structure freely",
    picker_cancel: "[esc] cancel",

    // Create dialog
    create_title_preset: "confirm_template",
    create_title_blank: "new_template",
    create_label_name: "name",
    create_label_desc: "description",
    create_desc_optional: "// optional",
    create_back: "← back",
    create_submit: "$ create_template",
    create_creating: "creating…",

    // Delete dialog
    delete_title: "delete_template",
    delete_subtitle: "-- this action cannot be undone",
    delete_confirm: (name: string) => `Confirm deletion of "${name}"?`,
    delete_cancel: "cancel",
    delete_submit: "$ delete",

    // Settings
    settings_title: "settings",
    settings_subtitle: "-- workspace configuration",
    settings_name: "name",
    settings_workspace_id: "workspace_id",
    settings_role: "role",
    settings_lang_section: "// LANGUAGE",
    settings_lang_hint: "-- interface language",
    settings_api_new: "new key",
    settings_api_creating: "generating…",
    settings_api_empty: "// no API keys found · use the button to generate one",
    settings_api_footer: "// store your key safely · shown in full only when created",
    settings_api_copy: "Copy",
    settings_api_delete: "Delete",

    // Login
    login_subtitle: "template management",
    login_prompt_signin: "> enter your credentials to continue",
    login_prompt_signup: "> create your account and workspace",
    login_label_name: "name",
    login_label_email: "email",
    login_label_password: "password",
    login_label_confirm: "confirm password",
    login_pw_hint: "// min. 8 characters",
    login_forgot: "forgot?",
    login_err_credentials: "Incorrect email or password.",
    login_err_mismatch: "Passwords don't match.",
    login_err_register: "Error creating account.",
    login_err_generic: "Something went wrong.",
    login_success_created: "Account created! Signing in…",
    login_err_login_after: "Account created, but sign-in failed.",
    login_footer: "BINSTRUCT · OPEN SOURCE · MIT",

    // Builder
    builder_back: "templates",
    builder_disk: "on_disk",
    builder_zip: "export_zip",
    builder_save: "$ save",
    builder_saving: "saving…",
    builder_structure: "// STRUCTURE",
    builder_editing: "// editing:",
    builder_name: "name",
    builder_content: "content",
    builder_add_file: "+ file",
    builder_add_folder: "+ folder",
    builder_select_hint: "// select a node to edit",
    builder_disk_title: "create_on_disk",
    builder_disk_subtitle: "-- choose a location and the browser will create the folders",
    builder_disk_cancel: "cancel",
    builder_disk_submit: "$ choose_location",
  },
} as const;

export type TranslationKey = keyof typeof t.es;

export function useTranslations(lang: Lang) {
  return t[lang];
}
