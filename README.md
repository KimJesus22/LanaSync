# 💰 App de Finanzas Personales con IA

Esta aplicación es un gestor de gastos inteligente diseñado para ayudar a los usuarios a controlar sus finanzas personales de manera eficiente, potenciado por Inteligencia Artificial.

## 🚀 Características Principales

### 1. Autenticación y Usuarios
- **Login/Registro**: Soporte para Email/Password, Magic Link y Google (vía Supabase Auth).
- **Perfiles**: Cada usuario tiene su propio perfil y datos aislados (Row Level Security).

### 2. Gestión de Transacciones
- **Registro Manual**: Ingresos y Gastos con categoría, método de pago (Efectivo/Vales) y descripción.
- **Registro por Voz 🎙️**:
    - Toca el micrófono y di: *"Gasto de 200 pesos en comida"*.
    - La app detecta automáticamente el monto, la categoría y la descripción.
- **Escaneo de Recibos con IA 🧾**:
    - Toca la cámara y toma una foto a tu ticket.
    - **Google Gemini** analiza la imagen y extrae el total, la fecha y la categoría automáticamente.

### 3. Control de Presupuestos (Topes) 📊
- Define límites de gasto por categoría (ej: $2000 para Comida).
- **Barra de Progreso**: Visualiza cuánto has gastado.
    - 🟢 Verde: < 75%
    - 🟡 Amarillo: 75% - 99%
    - 🔴 Rojo: > 100% (¡Alerta!)

### 4. Gastos Recurrentes 🔄
- Configura gastos fijos (Netflix, Renta, Gimnasio).
- Se cargan automáticamente o sirven de recordatorio mensual.

### 5. Asistente Financiero IA 🤖
- Un chat flotante siempre disponible.
- **Contexto Inteligente**: La IA conoce tus saldos y gastos actuales.
- **Consultas**: Pregunta *"¿Puedo gastar 500 pesos?"* y recibe consejos personalizados basados en tu realidad financiera.

---

## 🛠️ Arquitectura Técnica

### Frontend
- **Framework**: React + Vite
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Estado**: Context API (`FinanzasContext`)

### Backend (Supabase)
- **Base de Datos**: PostgreSQL
- **Auth**: Supabase Auth
- **Almacenamiento**: Supabase Storage (para avatares, opcional)
- **Edge Functions (Deno)**:
    1.  `scan-receipt`: Procesa imágenes de recibos con Gemini Vision.
    2.  `financial-advisor`: Chatbot financiero con contexto de base de datos.

### Esquema de Base de Datos
- `transactions`: Movimientos financieros.
- `members`: Perfiles de usuario.
- `budgets`: Presupuestos por categoría.
- `recurring_expenses`: Gastos fijos.

---

## 📦 Despliegue

### 1. Supabase (Backend)
Las Edge Functions requieren la variable de entorno `GEMINI_API_KEY`.

```bash
# Configurar API Key
npx supabase secrets set GEMINI_API_KEY=tu_api_key

# Desplegar Funciones
npx supabase functions deploy scan-receipt --no-verify-jwt
npx supabase functions deploy financial-advisor --no-verify-jwt
```

### 2. Vercel (Frontend)
Para asegurar **Zero Downtime Deployments**, configura el comando de construcción para correr los tests antes del build:

- **Build Command**: `npm run test && npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`

---

## 🧪 Testing
El proyecto incluye tests unitarios con **Vitest**.

```bash
npm run test
```

## 🔮 Futuras Mejoras
- Gráficos avanzados de tendencias.
- Exportación a Excel/PDF.
- Metas de ahorro compartidas.
