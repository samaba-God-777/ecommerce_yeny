# Configuración de Banco General para Pagos

## Pasos para configurar Banco General

### 1. Obtener Credenciales
- Ve a Banco General Developer Portal
- Crea una aplicación
- Obtén:
  - **Merchant ID**
  - **API Key**
  - **Secret Key**
  - **Endpoint** (sandbox o production)

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Luego pega tus credenciales en el archivo `.env`:
```
BANCO_GENERAL_MERCHANT_ID=tu_merchant_id_aqui
BANCO_GENERAL_API_KEY=tu_api_key_aqui
BANCO_GENERAL_SECRET_KEY=tu_secret_key_aqui
BANCO_GENERAL_ENDPOINT=https://api.bancoGeneral.com/v1
NODE_ENV=development
```

### 3. Archivos Configurados

- **Config**: `backend/config/bancoGeneral.js` - Configuración principal
- **Service**: `backend/services/paymentService.js` - Lógica de pagos
- **Routes**: `backend/routes/payments.js` - Endpoints de API

### 4. Endpoints de API

Una vez configurados, los siguientes endpoints estarán disponibles:

#### Procesar Pago
```
POST /api/payments/process
Content-Type: application/json

{
  "monto": 99.99,
  "referencia": "ORDER-12345",
  "descripcion": "Compra en Yenyleths Boutique",
  "email": "cliente@example.com",
  "nombreTitular": "Juan Pérez",
  "numeroTarjeta": "****1234"
}
```

#### Verificar Estado
```
GET /api/payments/verify/ORDER-12345
```

#### Reembolsar
```
POST /api/payments/refund
Content-Type: application/json

{
  "referencia": "ORDER-12345",
  "monto": 99.99
}
```

### 5. Integración en Frontend

En el checkout, llamar a:
```javascript
const respuesta = await fetch('/api/payments/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    monto: cartTotal,
    referencia: orderId,
    descripcion: 'Compra en Yenyleths',
    email: customerEmail,
    nombreTitular: customerName,
  })
})
```

### 6. Documentación de Referencia

- [Banco General API Docs](https://www.bancoGeneral.com/developers)
- Backend: `backend/services/paymentService.js` (contiene comentarios)

---

**Estado**: ✓ Estructura lista para configurar
**Próximo paso**: Pega tus credenciales en `.env`
