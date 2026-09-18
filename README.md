# Yenyleths Store - Ecommerce Premium

Proyecto completo de ecommerce con **Frontend** (Tienda), **Backend** (API), y **Panel Administrador**.

## 📂 Estructura

```
ecommerce_yeny/
├── frontend/          # Tienda web (React + Vite + TypeScript)
├── backend/           # API Express + JSON DB
├── administrador/     # Panel admin (React + Vite + TypeScript)
├── image/            # Imágenes originales
└── ui-ux-pro-max-skill-main/  # Skill de design
```

## 🚀 Cómo levantar

### 1. Backend (Puerto 5000)

```bash
cd backend
npm start
```

Endpoints:
- `GET  /api/categories` - Listar categorías
- `GET  /api/products` - Listar productos
- `POST /api/categories` - Crear categoría
- `POST /api/products` - Crear producto

### 2. Frontend (Puerto 5175)

```bash
cd frontend
npm run dev
```

Tienda web en: http://localhost:5175

### 3. Administrador (Puerto 5173)

```bash
cd administrador
npm run dev
```

Panel admin en: http://localhost:5173

## 📝 Flujo de trabajo

1. **Administrador** sube categoría con imagen
2. **Backend** guarda en `db.json` (archivo JSON local)
3. **Frontend** consume desde API y muestra productos en Home y categorías

## 🗂️ Persistencia

Los datos se guardan en `backend/db.json` como JSON plano. Es fácil migrar a una BD real después (PostgreSQL, MongoDB, etc).

## 🖼️ Carga de imágenes

- Las imágenes se guardan en `backend/uploads/`
- Están disponibles en `/uploads/<carpeta>/` en la API
- El administrador puede subir múltiples imágenes por producto

## 🔗 Conexión

El frontend solicita datos a `http://localhost:5000/api` (configurable en componentes).
