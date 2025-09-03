import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { ENDPOINTS } from '../endpoints';
import { 
  projectSchema,
  projectsListSchema 
} from '@/features/projects/schemas';
import type { 
  Project, 
  CreateProjectData, 
  UpdateProjectData,
} from '@/features/projects/schemas';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params: Record<string, string | number>) => 
    [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Hook para obtener lista de proyectos
export function useProjects(params: Record<string, string | number> = {}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.PROJECTS, { params });
      return projectsListSchema.parse(data);
    },
  });
}

// Hook para obtener un proyecto específico
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.PROJECT_BY_ID(id));
      return projectSchema.parse(data);
    },
    enabled: !!id,
  });
}

// Hook para crear proyecto
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProject: CreateProjectData) => {
      const { data } = await api.post(ENDPOINTS.PROJECTS, newProject);
      return projectSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Hook para actualizar proyecto
export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectData }) => {
      const response = await api.put(ENDPOINTS.PROJECT_BY_ID(id), data);
      return projectSchema.parse(response.data);
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(
        projectKeys.detail(updatedProject.id), 
        updatedProject
      );
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Hook para toggle estado de proyecto
export function useToggleProjectStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: 'ACTIVO' | 'INACTIVO' }) => {
      const { data } = await api.patch(ENDPOINTS.PROJECT_TOGGLE_STATUS(id), { estado });
      return projectSchema.parse(data);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });
      await queryClient.cancelQueries({ queryKey: projectKeys.detail(variables.id) });
      
      const previousLists = queryClient.getQueriesData({ queryKey: projectKeys.lists() });
      const previousDetail = queryClient.getQueryData(projectKeys.detail(variables.id));
      
      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: projectKeys.lists() }, 
        (old: unknown) => {
          if (!old || typeof old !== 'object' || !('items' in old)) return old;
          const list = old as { items: Project[] };
          
          return {
            ...list,
            items: list.items.map((project: Project) =>
              project.id === variables.id 
                ? { ...project, estado: variables.estado }
                : project
            ),
          };
        }
      );
      
      if (previousDetail) {
        queryClient.setQueryData(
          projectKeys.detail(variables.id),
          (old: Project | undefined) => 
            old ? { ...old, estado: variables.estado } : old
        );
      }
      
      return { previousLists, previousDetail };
    },
    onError: (_error, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      if (context?.previousDetail) {
        queryClient.setQueryData(
          projectKeys.detail(variables.id),
          context.previousDetail
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

// Hook para eliminar proyecto
export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ENDPOINTS.PROJECT_BY_ID(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
