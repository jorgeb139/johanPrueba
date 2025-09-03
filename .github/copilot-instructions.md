<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Sistema de Gestión de Desarrolladores y Proyectos

Este es un proyecto React + TypeScript con Vite que implementa un sistema CRUD completo para gestionar desarrolladores y proyectos.

## Arquitectura y Tecnologías

- **Framework**: React 18 + TypeScript + Vite
- **Estilos**: TailwindCSS con ShadCN/UI
- **Estado Global**: Zustand para estado de UI
- **Data Fetching**: TanStack Query para manejo de datos de servidor
- **Formularios**: React Hook Form + Zod para validación
- **Routing**: React Router DOM
- **Cliente HTTP**: Axios

## API Integration

- **Base URL**: https://apipruebas3.rbu.cl
- **Autenticación**: Bearer token en header Authorization
- **Endpoints**: CRUD completo para desarrolladores y proyectos, con asignaciones many-to-many

## Estructura del Proyecto

```
src/
  api/              # Cliente HTTP y hooks de TanStack Query  
  features/         # Features organizados por dominio
    developers/     # CRUD de desarrolladores
    projects/       # CRUD de proyectos  
    assignments/    # Gestión de asignaciones
  store/           # Estado global con Zustand
  components/      # Componentes reutilizables y UI de ShadCN
  lib/             # Utilidades (validación RUT, fechas)
  types/           # Tipos TypeScript globales
```

## Patrones y Convenciones

- **Feature-based architecture** con separación clara de responsabilidades
- **Schemas de Zod** para validación y tipado
- **Custom hooks** para lógica de negocio
- **Optimistic updates** para mejor UX
- **Error boundaries** para manejo robusto de errores
- **Accessibility-first** con ARIA labels y navegación por teclado

## Funcionalidades Requeridas

1. **CRUD Desarrolladores**: Crear, leer, actualizar, soft delete y reactivar
2. **CRUD Proyectos**: Mismas operaciones que desarrolladores  
3. **Asignaciones**: Asignar/desasignar desarrolladores a proyectos
4. **Filtros**: Búsqueda y filtrado por múltiples criterios
5. **Validaciones**: RUT chileno, emails, fechas, rangos numéricos
6. **Responsive UI**: Diseño móvil-first con componentes adaptativos

## Instrucciones Específicas para Copilot

- Usar siempre TypeScript estricto con tipos explícitos
- Implementar validación con Zod schemas
- Seguir patrones de React Query para data fetching
- Usar componentes de ShadCN/UI consistentemente
- Implementar manejo de errores robusto
- Considerar accesibilidad en todos los componentes
- Aplicar principios de Clean Code y SOLID
