import { X } from 'lucide-react';
import { useState } from 'react';

interface DeveloperFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeveloperFormData) => void;
}

export interface DeveloperFormData {
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string;
  aniosExperiencia: number;
}

export default function DeveloperFormModal({ isOpen, onClose, onSubmit }: DeveloperFormModalProps) {
  const [formData, setFormData] = useState<DeveloperFormData>({
    nombre: '',
    rut: '',
    correoElectronico: '',
    fechaContratacion: '',
    aniosExperiencia: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DeveloperFormData, string>>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    const newErrors: Partial<Record<keyof DeveloperFormData, string>> = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.rut.trim()) newErrors.rut = 'El RUT es requerido';
    if (!formData.correoElectronico.trim()) newErrors.correoElectronico = 'El email es requerido';
    if (!formData.fechaContratacion) newErrors.fechaContratacion = 'La fecha es requerida';
    if (formData.aniosExperiencia < 0) newErrors.aniosExperiencia = 'Los años de experiencia deben ser >= 0';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({
      nombre: '',
      rut: '',
      correoElectronico: '',
      fechaContratacion: '',
      aniosExperiencia: 0,
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof DeveloperFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Nuevo Desarrollador</h2>
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
              Nombre completo *
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.nombre ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-2">
              RUT *
            </label>
            <input
              type="text"
              id="rut"
              value={formData.rut}
              onChange={(e) => handleInputChange('rut', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.rut ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: 12345678-9"
            />
            {errors.rut && <p className="mt-1 text-sm text-red-600">{errors.rut}</p>}
          </div>

          <div>
            <label htmlFor="correoElectronico" className="block text-sm font-medium text-slate-700 mb-2">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="correoElectronico"
              value={formData.correoElectronico}
              onChange={(e) => handleInputChange('correoElectronico', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.correoElectronico ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: juan@email.com"
            />
            {errors.correoElectronico && <p className="mt-1 text-sm text-red-600">{errors.correoElectronico}</p>}
          </div>

          <div>
            <label htmlFor="fechaContratacion" className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de contratación *
            </label>
            <input
              type="date"
              id="fechaContratacion"
              value={formData.fechaContratacion}
              onChange={(e) => handleInputChange('fechaContratacion', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.fechaContratacion ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.fechaContratacion && <p className="mt-1 text-sm text-red-600">{errors.fechaContratacion}</p>}
          </div>

          <div>
            <label htmlFor="aniosExperiencia" className="block text-sm font-medium text-slate-700 mb-2">
              Años de experiencia *
            </label>
            <input
              type="number"
              id="aniosExperiencia"
              min="0"
              value={formData.aniosExperiencia}
              onChange={(e) => handleInputChange('aniosExperiencia', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.aniosExperiencia ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: 5"
            />
            {errors.aniosExperiencia && <p className="mt-1 text-sm text-red-600">{errors.aniosExperiencia}</p>}
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
              Crear Desarrollador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
