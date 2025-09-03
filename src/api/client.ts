import axios from 'axios';

// Configuración base del cliente API
export const api = axios.create({
  baseURL: 'https://apipruebas3.rbu.cl',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config) => {
    // El token se debería obtener del contexto de autenticación
    // Por ahora lo hardcodeamos para desarrollo
    const token = sessionStorage.getItem('auth_token') || 'YOUR_TOKEN_HERE';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    if (error.response?.status === 401) {
      // Token expirado o inválido
      sessionStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    // Mejorar mensajes de error
    const message = error.response?.data?.message || error.message || 'Error inesperado';
    error.userMessage = message;
    
    return Promise.reject(error);
  }
);

export default api;
