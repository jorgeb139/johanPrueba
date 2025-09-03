import { z } from 'zod';
import { isValidRUT } from '@/lib/rut';

// Schema para desarrolladores según la API
export const developerSchema = z.object({
  codigoDesarrollador: z.number(),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
  rut: z.string().refine(isValidRUT, 'RUT inválido').max(10),
  correoElectronico: z.string().email('Email inválido').max(100),
  fechaContratacion: z.string(), // formato: YYYY-MM-DDTHH:mm:ss
  aniosExperiencia: z.number().int().min(0, 'Los años de experiencia no pueden ser negativos'),
  registroActivo: z.boolean(),
});

// Schema para crear desarrollador
export const createDeveloperSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
  rut: z.string().refine(isValidRUT, 'RUT inválido').max(10),
  correoElectronico: z.string().email('Email inválido').max(100),
  fechaContratacion: z.string(), // formato: YYYY-MM-DDTHH:mm:ss
  aniosExperiencia: z.number().int().min(0, 'Los años de experiencia no pueden ser negativos'),
});

// Schema para actualizar desarrollador
export const updateDeveloperSchema = createDeveloperSchema.partial();

// Tipos TypeScript inferidos
export type Developer = z.infer<typeof developerSchema>;
export type CreateDeveloperData = z.infer<typeof createDeveloperSchema>;
export type UpdateDeveloperData = z.infer<typeof updateDeveloperSchema>;

// Lista de desarrolladores (sin paginación según API)
export const developersListSchema = z.array(developerSchema);

export type DevelopersList = z.infer<typeof developersListSchema>;
