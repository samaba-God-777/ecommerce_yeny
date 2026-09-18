# 🚀 Yenyleths Store - Inicio Rápido

## Terminal 1: Backend (Puerto 5000)

```bash
cd /Users/bstar/Desktop/ecommerce_yeny/backend
npm start
```

**Endpoints disponibles:**
- `GET  http://localhost:5000/api/categories` → Listar categorías
- `GET  http://localhost:5000/api/products` → Listar productos
- `POST http://localhost:5000/api/products` → Crear producto
- `POST http://localhost:5000/api/categories` → Crear categoría

---

## Terminal 2: Frontend Tienda (Puerto 5175)

```bash
cd /Users/bstar/Desktop/ecommerce_yeny/frontend
npm run dev
```

🛍️ Abre: http://localhost:5175

---

## Terminal 3: Admin Panel (Puerto 5173)

```bash
cd /Users/bstar/Desktop/ecommerce_yeny/administrador
npm run dev
```

👨‍💼 Abre: http://localhost:5173

---

## ✅ Verificar que funciona

```bash
# En otra terminal:
curl http://localhost:5000/api/categories | jq .
curl http://localhost:5000/api/products | jq .
```

## 📂 Base de datos

- **Archivo:** `backend/db.json`
- **Formato:** JSON simple
- **Se actualiza automáticamente** al crear/eliminar desde admin panel

## 🛑 Detener todo

Presiona `Ctrl+C` en cada terminal
