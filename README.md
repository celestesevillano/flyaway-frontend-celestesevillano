# Fly Away Travel — Frontend

Frontend web de la app de reserva de vuelos **Fly Away**, para el Laboratorio de la Semana 14 de CS2031 (DBP).

**Autora:** Celeste Sevillano  
**Stack:** React 19 + TypeScript + Vite + Axios + React Router. Estilos en CSS plano (tema rosa).

---

## Cómo correrlo

### 1. Levantar el backend

El frontend consume la API en `http://localhost:8080`. Necesita **JDK 26**.

```bash
git clone https://github.com/CS2031-DBP/cs2031-2026-2-week14-fly-away-backend.git
cd cs2031-2026-2-week14-fly-away-backend
./mvnw spring-boot:run
```

### 2. Levantar el frontend

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

Si el backend corre en otro puerto, copia `.env.example` a `.env` y cambia `VITE_API_URL`.

### Usuarios de prueba

- Email: `ana.garcia@utec.edu.pe`
- Contraseña: `Password1`

---

## Funcionalidades

| Pantalla | Endpoint | Qué hace |
|---|---|---|
| Registro (`/register`) | `POST /users/register` | Formulario con email, nombre, apellido y contraseña. Valida campos vacíos, muestra errores del backend y redirige al login. |
| Login (`/login`) | `POST /auth/login` + `GET /users/current` | Guarda el JWT en `localStorage`, muestra errores, redirige a búsqueda y muestra el nombre del usuario. |
| Búsqueda (`/search`) | `GET /flights/search` | Filtros por número, aerolínea y rango de fechas. Tabla con resultados y mensaje cuando no hay vuelos. |
| Reserva | `POST /flights/book` | Botón Reservar (solo autenticados). Muestra ID de reserva y errores del backend. |
| Mis reservas (`/bookings`) | `GET /flights/book/{id}` | Lista reservas del usuario (IDs en localStorage por email). |
| Detalle (`/bookings/:id`) | `GET /flights/book/{id}` | Detalle completo de una reserva. |
| Logout y navegación | — | Limpia token, rutas protegidas y navegación entre pantallas. |

---

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo en http://localhost:5173 |
| `npm run build` | chequeo de tipos + build de producción |
| `npm run preview` | sirve el build de producción |
