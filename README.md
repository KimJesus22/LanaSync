# LanaSync 💸 | PWA de Finanzas Familiares en Tiempo Real

> **Gestión financiera inteligente para familias modernas.**
> *Arquitectura Serverless • Sincronización Real-Time • Diseño Mobile-First*

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Sobre el Proyecto

**LanaSync** no es solo otra app de gastos. Es una solución de ingeniería diseñada para resolver un problema específico de la economía doméstica moderna: la gestión de **múltiples fuentes de liquidez** en un entorno colaborativo.

Construida como una **Progressive Web App (PWA)**, ofrece una experiencia nativa en Android/iOS sin la fricción de las tiendas de aplicaciones, garantizando que el control financiero esté siempre al alcance del bolsillo.

## 🛠️ Stack Tecnológico

Diseñé la arquitectura enfocándome en la escalabilidad, el rendimiento y la experiencia de desarrollo (DX).

*   **Frontend**: React 18 + Vite (Velocidad de build y HMR instantáneo).
*   **Backend as a Service**: Supabase (PostgreSQL + Auth + Realtime).
*   **Estilos**: Tailwind CSS (Sistema de diseño utilitario para UI consistente).
*   **Iconografía**: Lucide React.
*   **Visualización de Datos**: Recharts.
*   **PWA**: `vite-plugin-pwa` con estrategia de caché y actualización automática.

```mermaid
 graph TD
    User((Usuario: Jesus/Adrian/Daniel)) -->|Interactúa UI| PWA[LanaSync PWA (React + Vite)]
    PWA -->|Lectura/Escritura| SupaDB[(Supabase PostgreSQL)]
    SupaDB -->|Realtime Subscription| PWA
    
    subgraph Lógica de Negocio
    PWA -- Calcula --> Wallet1[Saldo Efectivo]
    PWA -- Calcula --> Wallet2[Saldo Vales]
    PWA -- Verifica --> Gamification[Motor de Logros]
    end
    
    style PWA fill:#1f2937,stroke:#10b981,color:#fff
    style SupaDB fill:#3ecf8e,stroke:#3ecf8e,color:#fff
```

## 💡 Engineering Highlights

### 1. El Desafío de la Doble Divisa Lógica 💱
La mayoría de las apps financieras agregan todos los activos en un solo "Patrimonio Neto". Sin embargo, en la realidad operativa de muchas familias, el **Efectivo** y los **Vales de Despensa** no son fungibles.
*   **Solución**: Implementé una lógica de negocio estricta que segrega estos activos. El sistema calcula balances independientes y previene que el saldo de Vales infle la percepción de liquidez en efectivo ("Dinero Libre"), evitando decisiones de gasto erróneas.

### 2. Sincronización en Tiempo Real (WebSockets) ⚡
Para una pareja o familia, ver datos desactualizados es crítico.
*   **Implementación**: Utilicé las suscripciones de **Supabase Realtime** para escuchar cambios (`INSERT`, `DELETE`) en la base de datos PostgreSQL.
*   **Resultado**: Si el Usuario A agrega un gasto en el supermercado, el Dashboard del Usuario B se actualiza **en milisegundos** sin necesidad de refrescar la pantalla.

### 3. Gamificación y UX 🎮
El ahorro es un hábito difícil. Para reducir la fricción cognitiva:
*   **Motivational Card**: Inyección de frases aleatorias para mantener el foco.
*   **Sistema de Logros**: Lógica condicional que evalúa el comportamiento de gasto al cierre de mes (día 30) y recompensa visualmente (Confetti) si se cumplen las metas de austeridad en categorías críticas como "Ocio".

## 🚀 Instalación y Despliegue

Sigue estos pasos para correr el proyecto localmente:

### Prerrequisitos
*   Node.js (v16+)
*   Cuenta en Supabase

### Pasos

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/KimJesus22/LanaSync.git
    cd lanasync
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz y agrega tus credenciales de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_anon_key
    ```

4.  **Base de Datos (SQL)**
    Ejecuta el script de migración incluido (`members_migration.sql`) en el SQL Editor de Supabase para configurar las tablas y políticas RLS.

5.  **Correr en Desarrollo**
    ```bash
    npm run dev
    ```

## 📱 Instalación en Móvil (PWA)

1.  Accede a la aplicación desde Chrome en Android o Safari en iOS.
2.  Selecciona **"Agregar a la pantalla de inicio"**.
3.  La app se instalará como una aplicación nativa, eliminando la barra de navegación del navegador.

---

Desarrollado con ❤️ y ☕ por [KimJesus21].
