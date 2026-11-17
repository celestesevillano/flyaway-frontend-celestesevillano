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

## Funcionalidades (en construcción progresiva)

Este es el PR 1 de 5: scaffold base con tema rosa y layout.
