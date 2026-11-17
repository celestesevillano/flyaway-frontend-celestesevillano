# Fly Away Travel — Frontend

Aplicación web para la reserva de vuelos del laboratorio de la Semana 14 del curso **CS2031 — Desarrollo Basado en Plataformas** (UTEC).

**Autora:** Celeste Sevillano  
**Stack:** React 19, TypeScript, Vite, Axios y React Router. Estilos propios en CSS plano.

---

## Requisitos previos

- Node.js 18 o superior
- El backend oficial del laboratorio corriendo en `http://localhost:8080` (requiere JDK 26)

## Ejecución local

### 1. Backend

```bash
git clone https://github.com/CS2031-DBP/cs2031-2026-2-week14-fly-away-backend.git
cd cs2031-2026-2-week14-fly-away-backend
./mvnw spring-boot:run
```

### 2. Frontend

```bash
npm install
npm run dev
```

La aplicación queda disponible en [http://localhost:5173](http://localhost:5173).

Si el backend usa otro puerto o host, copia `.env.example` a `.env` y ajusta `VITE_API_URL`.

### Usuarios de prueba

El backend carga datos de ejemplo al iniciar. Puedes ingresar con:

- Email: `ana.garcia@utec.edu.pe`
- Contraseña: `Password1`

---

## Funcionalidades implementadas

| Pantalla | Endpoint | Descripción |
|----------|----------|-------------|
| Registro | `POST /users/register` | Creación de cuenta con validación de campos y manejo de errores del backend. |
| Inicio de sesión | `POST /auth/login` + `GET /users/current` | Autenticación con JWT, almacenamiento del token y visualización del nombre del usuario. |
| Búsqueda de vuelos | `GET /flights/search` | Filtros por número de vuelo, aerolínea y rango de fechas de salida. Resultados en tabla. |
| Reserva | `POST /flights/book` | Reserva de un vuelo (requiere sesión activa). Muestra el ID de reserva y los errores del servidor. |
| Mis reservas | `GET /flights/book/{id}` | Listado de las reservas del usuario autenticado. |
| Detalle de reserva | `GET /flights/book/{id}` | Información completa de una reserva. |

Las rutas de reservas están protegidas y redirigen al login cuando no hay sesión activa. El cierre de sesión limpia el token almacenado.

---

## Scripts

| Comando | Descripción |
|---------|--------------|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Compila la aplicación para producción. |
| `npm run preview` | Sirve la versión compilada localmente. |
