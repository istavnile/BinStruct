# BinStruct

**Crea, organiza y exporta estructuras de carpetas para producción audiovisual.**

BinStruct es una aplicación web que permite diseñar plantillas de estructura de carpetas para proyectos de video, cine, fotografía y agencias digitales. Las plantillas se guardan en la nube y pueden exportarse como ZIP, escribirse directamente al disco, o importarse/exportarse en JSON.

---

## Características

- **Editor de árbol visual** — Construye jerarquías de carpetas y archivos con un editor tipo IDE, con panel resizable y colores por sección.
- **Variables dinámicas** — Usa tokens como `[NOMBRE_DEL_PROYECTO]` o `[CLIENTE]` en los nombres; al exportar la app los detecta y te pide los valores.
- **Exportar a ZIP** — Descarga la estructura completa como `.zip` con un clic.
- **Escribir al disco** — Usa la File System Access API del navegador para crear las carpetas directamente en tu sistema de archivos (Chrome/Edge/Safari).
- **Exportar / Importar JSON** — Comparte o respalda plantillas en formato JSON.
- **Duplicar plantillas** — Clona una plantilla existente como punto de partida.
- **Buscador** — Filtra plantillas por nombre o descripción.
- **Autenticación** — Sistema de login con workspaces, recuperación de contraseña por email y cambio de contraseña desde configuración.
- **Bilingüe** — Interfaz en español e inglés.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Base de datos | PostgreSQL + Prisma v7 |
| Auth | NextAuth.js |
| UI | Tailwind CSS + Base UI |
| ZIP | JSZip + file-saver |
| Email | Nodemailer |
| Deploy | Docker (standalone) · EasyPanel |

---

## Variables de entorno

```env
DATABASE_URL=postgresql://user:password@host:5432/db
NEXTAUTH_SECRET=un_secreto_aleatorio
NEXTAUTH_URL=https://tu-dominio.com

# Email (recuperación de contraseña)
EMAIL_HOST=smtp.tu-proveedor.com
EMAIL_PORT=587
EMAIL_USER=tu@email.com
EMAIL_PASS=tu_contraseña
EMAIL_FROM=BinStruct <no-reply@tu-dominio.com>
```

---

## Desarrollo local

```bash
npm install
npx prisma migrate dev
npm run dev
```

---

## Deploy con Docker

```bash
docker build -t binstruct .
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e NEXTAUTH_SECRET=... \
  -e NEXTAUTH_URL=... \
  binstruct
```

El entrypoint ejecuta `prisma migrate deploy` automáticamente antes de arrancar el servidor.

---

*desarrollado por Istav Nile @ 12 Development*
