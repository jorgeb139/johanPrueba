import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { projectSchema, type ProjectFormData } from '@/lib/validations';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: ProjectFormData | null;
  title?: string;
}

export type { ProjectFormData };

export default function ProjectFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  title 
}: ProjectFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      nombre: '',
      fechaInicio: '',
      fechaTermino: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        fechaInicio: initialData.fechaInicio.split('T')[0], // Solo la fecha para input date
        fechaTermino: initialData.fechaTermino.split('T')[0], // Solo la fecha para input date
      });
    } else {
      reset({
        nombre: '',
        fechaInicio: '',
        fechaTermino: '',
      });
    }
  }, [initialData, isOpen, reset]);

  const onSubmitForm = (data: ProjectFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">{title ?? 'Nuevo Proyecto'}</h2>
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
              Nombre del proyecto *
            </label>
            <input
              {...register('nombre')}
              type="text"
              id="nombre"
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nombre ? 'border-red-500' : ''
              }`}
              placeholder="Ej: Sistema ERP Empresarial"
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de inicio *
            </label>
            <input
              {...register('fechaInicio')}
              type="date"
              id="fechaInicio"
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.fechaInicio ? 'border-red-500' : ''
              }`}
            />
            {errors.fechaInicio && (
              <p className="text-red-600 text-sm mt-1">{errors.fechaInicio.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fechaTermino" className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de término *
            </label>
            <input
              {...register('fechaTermino')}
              type="date"
              id="fechaTermino"
              className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.fechaTermino ? 'border-red-500' : ''
              }`}
            />
            {errors.fechaTermino && (
              <p className="text-red-600 text-sm mt-1">{errors.fechaTermino.message}</p>
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
