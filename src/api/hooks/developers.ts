import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { ENDPOINTS } from '../endpoints';
import { 
  developerSchema,
  developersListSchema 
} from '@/features/developers/schemas';
import type { 
  CreateDeveloperData, 
  UpdateDeveloperData,
} from '@/features/developers/schemas';

// Query keys
export const developerKeys = {
  all: ['developers'] as const,
  lists: () => [...developerKeys.all, 'list'] as const,
  list: (params: Record<string, string | number>) => 
    [...developerKeys.lists(), params] as const,
  details: () => [...developerKeys.all, 'detail'] as const,
  detail: (id: number) => [...developerKeys.details(), id] as const,
};

// Hook para obtener lista de desarrolladores
export function useDevelopers(params: Record<string, string | number> = {}) {
  return useQuery({
    queryKey: developerKeys.list(params),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.DEVELOPERS, { params });
      return developersListSchema.parse(data);
    },
  });
}

// Hook para obtener un desarrollador específico
export function useDeveloper(id: number) {
  return useQuery({
    queryKey: developerKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.DEVELOPER_BY_ID(id.toString()));
      return developerSchema.parse(data);
    },
    enabled: !!id,
  });
}

// Hook para crear desarrollador
export function useCreateDeveloper() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newDeveloper: CreateDeveloperData) => {
      const { data } = await api.post(ENDPOINTS.DEVELOPERS, newDeveloper);
      return developerSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.lists() });
    },
  });
}

// Hook para actualizar desarrollador
export function useUpdateDeveloper() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateDeveloperData }) => {
      const response = await api.put(ENDPOINTS.DEVELOPER_BY_ID(id.toString()), data);
      return developerSchema.parse(response.data);
    },
    onSuccess: (updatedDeveloper) => {
      queryClient.setQueryData(
        developerKeys.detail(updatedDeveloper.codigoDesarrollador), 
        updatedDeveloper
      );
      queryClient.invalidateQueries({ queryKey: developerKeys.lists() });
    },
  });
}

// Hook para eliminar desarrollador (soft delete)
export function useDeleteDeveloper() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(ENDPOINTS.DEVELOPER_BY_ID(id.toString()));
      return developerSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.all });
    },
  });
}

// Hook para reactivar desarrollador
export function useReactivateDeveloper() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.put(ENDPOINTS.DEVELOPER_REACTIVATE(id.toString()));
      return developerSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.all });
    },
  });
}
