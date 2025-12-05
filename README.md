# 💰 LanaSync - App de Finanzas Personales con IA

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![Playwright](https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)

**LanaSync** es un gestor de gastos inteligente diseñado para ayudar a los usuarios a controlar sus finanzas personales de manera eficiente, potenciado por Inteligencia Artificial.

## 🚀 Características Principales

### 1. Experiencia de Usuario
- **Landing Page de Conversión**: Página de inicio optimizada para captar usuarios.
- **Modo Offline**: Funciona sin internet y sincroniza cuando recuperas la conexión.
- **PWA Instalable**: Instálala en tu celular como una app nativa (Android/iOS).

### 2. Gestión de Transacciones
- **Registro Manual**: Ingresos y Gastos con categoría y método de pago.
- **Registro por Voz 🎙️**: "Gasto de 200 pesos en comida" -> La IA lo registra.
- **Escaneo de Recibos con IA 🧾**: Toma una foto a tu ticket y Gemini extrae los datos.

### 3. Control Financiero 📊
- **Presupuestos**: Define topes de gasto con barras de progreso (Verde/Amarillo/Rojo).
- **Gastos Recurrentes**: Automatiza tus pagos fijos (Netflix, Renta).
- **Metas Compartidas**: Gestiona finanzas en pareja o familia.

### 4. Asistente IA 🤖
- Chatbot financiero con contexto de tu base de datos.
- Pregunta: *"¿Puedo gastar 500 pesos?"* y recibe consejos reales.

### 5. Legal y Seguridad ⚖️
- **Centro Legal**: Política de Privacidad y Términos de Servicio (`/legal`).
- **GDPR**: Banner de cookies y manejo responsable de datos.

---

## 🛠️ Arquitectura Técnica

### Frontend
- **Framework**: React + Vite
- **Estilos**: Tailwind CSS
- **Estado**: Context API
- **Routing**: React Router (con protección de rutas y redirección inteligente).

### Backend (Serverless)
- **Base de Datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Edge Functions**: Deno (para lógica de IA y seguridad).

### Infraestructura
- **Docker**: Contenedores optimizados (Multi-stage build).
- **Nginx**: Servidor web ligero para el frontend.
- **Play Store**: Configurado con `assetlinks.json` y Bubblewrap.

---

## 📦 Despliegue y Ejecución

### Opción A: Docker (Recomendada) 🐳

Levanta toda la aplicación con un solo comando:

```bash
docker-compose up --build -d
```

La app estará disponible en `http://localhost:8080`.

### Opción B: Desarrollo Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Correr servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Opción C: Google Play Store 📱

La app está lista para ser empaquetada como TWA (Trusted Web Activity).
- Ver guía de publicación en `play_store_guide.md`.
- Asset Links configurados en `public/.well-known/assetlinks.json`.

---

## 🧪 Testing

El proyecto cuenta con una suite de pruebas robusta:

- **Unitarias**: Vitest (`npm run test`)
- **End-to-End (E2E)**: Playwright

```bash
# Correr tests E2E
npx playwright test
```

---

## 💳 Monetización

Integración con **Stripe** para planes Premium (SaaS):
- Plan Gratuito (Básico)
- Plan Pro (IA ilimitada, Escáner, Metas)

---

© 2025 LanaSync.
