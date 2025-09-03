import { z } from 'zod';

// Schema para proyectos según la API
export const projectSchema = z.object({
  codigoProyecto: z.number(),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50),
  fechaInicio: z.string(), // formato: YYYY-MM-DDTHH:mm:ss
  fechaTermino: z.string(), // formato: YYYY-MM-DDTHH:mm:ss
  registroActivo: z.boolean(),
});

// Schema para crear proyecto
export const createProjectSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50),
  fechaInicio: z.string(), // formato: YYYY-MM-DDTHH:mm:ss
  fechaTermino: z.string(), // formato: YYYY-MM-DDTHH:mm:ss
});

// Schema para actualizar proyecto
export const updateProjectSchema = createProjectSchema.partial();

// Tipos TypeScript inferidos
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type UpdateProjectData = z.infer<typeof updateProjectSchema>;

// Lista de proyectos (sin paginación según API)
export const projectsListSchema = z.array(projectSchema);

export type ProjectsList = z.infer<typeof projectsListSchema>;
