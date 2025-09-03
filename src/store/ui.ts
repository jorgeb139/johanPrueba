import { create } from 'zustand';

// Tipos para filtros
export interface DeveloperFilters {
  search: string;
  estado: 'all' | 'ACTIVO' | 'INACTIVO';
  experienciaMin?: number;
  experienciaMax?: number;
  proyectosMin?: number;
  proyectosMax?: number;
}

export interface ProjectFilters {
  search: string;
  estado: 'all' | 'ACTIVO' | 'INACTIVO';
  fechaInicioDesde?: string;
  fechaInicioHasta?: string;
  desarrolladoresMin?: number;
  desarrolladoresMax?: number;
}

// Estado de la UI
interface UIState {
  // Filtros de desarrolladores
  developerFilters: DeveloperFilters;
  setDeveloperFilters: (filters: Partial<DeveloperFilters>) => void;
  clearDeveloperFilters: () => void;
  
  // Filtros de proyectos
  projectFilters: ProjectFilters;
  setProjectFilters: (filters: Partial<ProjectFilters>) => void;
  clearProjectFilters: () => void;
  
  // Estados de modal/drawer
  isAssignmentDrawerOpen: boolean;
  setAssignmentDrawerOpen: (open: boolean) => void;
  
  // ID del elemento seleccionado para asignaciones
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  
  // Tipo de asignación (desde desarrollador o desde proyecto)
  assignmentType: 'developer' | 'project' | null;
  setAssignmentType: (type: 'developer' | 'project' | null) => void;
}

// Valores por defecto
const defaultDeveloperFilters: DeveloperFilters = {
  search: '',
  estado: 'all',
};

const defaultProjectFilters: ProjectFilters = {
  search: '',
  estado: 'all',
};

export const useUIStore = create<UIState>((set) => ({
  // Filtros de desarrolladores
  developerFilters: defaultDeveloperFilters,
  setDeveloperFilters: (filters) =>
    set((state) => ({
      developerFilters: { ...state.developerFilters, ...filters },
    })),
  clearDeveloperFilters: () => set({ developerFilters: defaultDeveloperFilters }),
  
  // Filtros de proyectos
  projectFilters: defaultProjectFilters,
  setProjectFilters: (filters) =>
    set((state) => ({
      projectFilters: { ...state.projectFilters, ...filters },
    })),
  clearProjectFilters: () => set({ projectFilters: defaultProjectFilters }),
  
  // Estados de modal/drawer
  isAssignmentDrawerOpen: false,
  setAssignmentDrawerOpen: (open) => set({ isAssignmentDrawerOpen: open }),
  
  // Elemento seleccionado
  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  
  // Tipo de asignación
  assignmentType: null,
  setAssignmentType: (type) => set({ assignmentType: type }),
}));

// Selectores para obtener parámetros de query
export const useDeveloperFiltersParams = () => {
  const filters = useUIStore((state) => state.developerFilters);
  
  const params: Record<string, string | number> = {};
  
  if (filters.search) params.search = filters.search;
  if (filters.estado !== 'all') params.estado = filters.estado;
  if (filters.experienciaMin !== undefined) params.experienciaMin = filters.experienciaMin;
  if (filters.experienciaMax !== undefined) params.experienciaMax = filters.experienciaMax;
  if (filters.proyectosMin !== undefined) params.proyectosMin = filters.proyectosMin;
  if (filters.proyectosMax !== undefined) params.proyectosMax = filters.proyectosMax;
  
  return params;
};

export const useProjectFiltersParams = () => {
  const filters = useUIStore((state) => state.projectFilters);
  
  const params: Record<string, string | number> = {};
  
  if (filters.search) params.search = filters.search;
  if (filters.estado !== 'all') params.estado = filters.estado;
  if (filters.fechaInicioDesde) params.fechaInicioDesde = filters.fechaInicioDesde;
  if (filters.fechaInicioHasta) params.fechaInicioHasta = filters.fechaInicioHasta;
  if (filters.desarrolladoresMin !== undefined) params.desarrolladoresMin = filters.desarrolladoresMin;
  if (filters.desarrolladoresMax !== undefined) params.desarrolladoresMax = filters.desarrolladoresMax;
  
  return params;
};
