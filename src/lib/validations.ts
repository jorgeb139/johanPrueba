import { z } from 'zod';

// Función para validar RUT chileno
export function validateRUT(rut: string): boolean {
  if (!rut) return false;
  
  const cleaned = rut.replace(/[^0-9kK]/g, '');
  if (cleaned.length < 8 || cleaned.length > 9) return false;
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toLowerCase();
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const calculatedDV = remainder === 0 ? '0' : remainder === 1 ? 'k' : (11 - remainder).toString();
  
  return calculatedDV === dv;
}

// Schema para desarrolladores
export const developerSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  rut: z
    .string()
    .min(1, 'El RUT es requerido')
    .max(12, 'El RUT no puede exceder 12 caracteres')
    .refine(validateRUT, 'El RUT ingresado no es válido'),
  
  correoElectronico: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .email('Debe ser un correo electrónico válido')
    .refine((email) => {
      // Validación adicional para formato de correo más estricto
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, 'El formato del correo electrónico no es válido')
    .refine((email) => {
      // No permitir dominios temporales conocidos
      const tempDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
      const domain = email.split('@')[1]?.toLowerCase();
      return !tempDomains.includes(domain);
    }, 'No se permiten correos de dominios temporales'),
  
  fechaContratacion: z
    .string()
    .min(1, 'La fecha de contratación es requerida')
    .refine((date) => {
      const parsed = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return parsed <= today;
    }, 'La fecha de contratación no puede ser futura'),
  
  aniosExperiencia: z
    .number()
    .min(0, 'Los años de experiencia no pueden ser negativos')
    .max(50, 'Los años de experiencia no pueden exceder 50 años')
    .int('Debe ser un número entero'),
});

// Schema para proyectos
export const projectSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_]+$/, 'El nombre contiene caracteres inválidos'),
  
  fechaInicio: z
    .string()
    .min(1, 'La fecha de inicio es requerida'),
  
  fechaTermino: z
    .string()
    .min(1, 'La fecha de término es requerida'),
}).refine((data) => {
  const inicio = new Date(data.fechaInicio);
  const termino = new Date(data.fechaTermino);
  return termino > inicio;
}, {
  message: 'La fecha de término debe ser posterior a la fecha de inicio',
  path: ['fechaTermino'],
});

export type DeveloperFormData = z.infer<typeof developerSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
