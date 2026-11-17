import axios from 'axios';

export const TOKEN_KEY = 'token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      if (localStorage.getItem(TOKEN_KEY)) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.assign('/login?expired=1');
      }
    }
    return Promise.reject(error);
  },
);

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (err.response?.status === 403) return 'Tu sesion expiro. Inicia sesion de nuevo.';
    if (!err.response) return 'No se pudo conectar con el servidor. Verifica que el backend este corriendo en http://localhost:8080';
    return `Error ${err.response.status} del servidor.`;
  }
  return 'Ocurrio un error inesperado.';
}

export default api;
