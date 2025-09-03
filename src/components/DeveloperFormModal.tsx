import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { developerSchema, type DeveloperFormData } from '@/lib/validations';
import { formatRUT } from '@/lib/rut';

interface DeveloperFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeveloperFormData) => void;
  initialData?: DeveloperFormData | null;
  title?: string;
}

export type { DeveloperFormData };

export default function DeveloperFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  title 
}: DeveloperFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      nombre: '',
      rut: '',
      correoElectronico: '',
      fechaContratacion: '',
      aniosExperiencia: 0,
    }
  });

  // Observar el campo RUT para formateo en tiempo real
  const rutValue = watch('rut');

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        rut: initialData.rut,
        correoElectronico: initialData.correoElectronico,
        fechaContratacion: initialData.fechaContratacion.split('T')[0], // Solo la fecha para input date
        aniosExperiencia: initialData.aniosExperiencia,
      });
    } else {
      reset({
        nombre: '',
        rut: '',
        correoElectronico: '',
        fechaContratacion: '',
        aniosExperiencia: 0,
      });
    }
  }, [initialData, isOpen, reset]);

  // Formatear RUT mientras el usuario escribe
  useEffect(() => {
    if (rutValue && rutValue.length > 1) {
      const formatted = formatRUT(rutValue);
      if (formatted !== rutValue) {
        setValue('rut', formatted, { shouldValidate: true });
      }
    }
  }, [rutValue, setValue]);

  const onSubmitForm = (data: DeveloperFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">{title ?? 'Nuevo Desarrollador'}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
              Nombre completo *
            </label>
            <input
              {...register('nombre')}
              type="text"
              id="nombre"
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nombre ? 'border-red-500' : ''
              }`}
              placeholder="Ej: Juan Pérez González"
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-2">
              RUT *
            </label>
            <input
              {...register('rut')}
              type="text"
              id="rut"
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.rut ? 'border-red-500' : ''
              }`}
              placeholder="Ej: 12.345.678-9"
              maxLength={12}
            />
            {errors.rut && (
              <p className="text-red-600 text-sm mt-1">{errors.rut.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="correoElectronico" className="block text-sm font-medium text-slate-700 mb-2">
              Correo electrónico *
            </label>
            <input
              {...register('correoElectronico')}
              type="email"
              id="correoElectronico"
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.correoElectronico ? 'border-red-500' : ''
              }`}
              placeholder="ejemplo@correo.com"
            />
            {errors.correoElectronico && (
              <p className="text-red-600 text-sm mt-1">{errors.correoElectronico.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fechaContratacion" className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de contratación *
            </label>
            <input
              {...register('fechaContratacion')}
              type="date"
              id="fechaContratacion"
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.fechaContratacion ? 'border-red-500' : ''
              }`}
            />
            {errors.fechaContratacion && (
              <p className="text-red-600 text-sm mt-1">{errors.fechaContratacion.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="aniosExperiencia" className="block text-sm font-medium text-slate-700 mb-2">
              Años de experiencia *
            </label>
            <input
              {...register('aniosExperiencia', { valueAsNumber: true })}
              type="number"
              id="aniosExperiencia"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.aniosExperiencia ? 'border-red-500' : ''
              }`}
              placeholder="Ej: 5"
            />
            {errors.aniosExperiencia && (
              <p className="text-red-600 text-sm mt-1">{errors.aniosExperiencia.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
