// Endpoints centralizados de la API
export const ENDPOINTS = {
  // Test connection
  TEST_CONNECTION: '/api/test-connection',
  
  // Desarrolladores
  DEVELOPERS: '/api/desarrolladores',
  DEVELOPER_BY_ID: (id: string) => `/api/desarrolladores/${id}`,
  DEVELOPER_REACTIVATE: (id: string) => `/api/desarrolladores/${id}/reactivar`,
  DEVELOPER_PROJECTS: (id: string) => `/api/desarrolladores/${id}/proyectos`,
  
  // Proyectos  
  PROJECTS: '/api/proyectos',
  PROJECT_BY_ID: (id: string) => `/api/proyectos/${id}`,
  PROJECT_REACTIVATE: (id: string) => `/api/proyectos/${id}/reactivar`,
  PROJECT_DEVELOPERS: (id: string) => `/api/proyectos/${id}/desarrolladores`,
  
  // Asignaciones
  ASSIGN_DEVELOPER_TO_PROJECT: (projectId: string, developerId: string) => 
    `/api/proyectos/${projectId}/desarrolladores/${developerId}`,
} as const;
