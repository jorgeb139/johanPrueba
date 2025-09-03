import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: ProjectFormData | null;
  title?: string;
}

export interface ProjectFormData {
  nombre: string;
  fechaInicio: string;
  fechaTermino: string;
}

export default function ProjectFormModal({ isOpen, onClose, onSubmit, initialData = null, title }: ProjectFormModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: '',
    fechaInicio: '',
    fechaTermino: '',
  });

  // Sincronizar cuando se abre el modal en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ nombre: '', fechaInicio: '', fechaTermino: '' });
    }
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del proyecto es requerido';
    if (!formData.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es requerida';
    if (!formData.fechaTermino) newErrors.fechaTermino = 'La fecha de término es requerida';
    
    // Validar que la fecha de término sea posterior a la de inicio
    if (formData.fechaInicio && formData.fechaTermino) {
      if (new Date(formData.fechaTermino) <= new Date(formData.fechaInicio)) {
        newErrors.fechaTermino = 'La fecha de término debe ser posterior a la fecha de inicio';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({ nombre: '', fechaInicio: '', fechaTermino: '' });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del proyecto *
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.nombre ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: Sistema ERP Empresarial"
              maxLength={50}
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de inicio *
            </label>
            <input
              type="date"
              id="fechaInicio"
              value={formData.fechaInicio}
              onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.fechaInicio ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.fechaInicio && <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>}
          </div>

          <div>
            <label htmlFor="fechaTermino" className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de término *
            </label>
            <input
              type="date"
              id="fechaTermino"
              value={formData.fechaTermino}
              onChange={(e) => handleInputChange('fechaTermino', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.fechaTermino ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.fechaTermino && <p className="mt-1 text-sm text-red-600">{errors.fechaTermino}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {title ?? 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
