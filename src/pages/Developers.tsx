import { Plus, Search, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import type { Developer } from '@/features/developers/schemas';
import { useState } from 'react';
import { formatRUT } from '@/lib/rut';
import DeveloperFormModal, { type DeveloperFormData } from '@/components/DeveloperFormModal';

export default function DevelopersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Datos de prueba
  const [mockDevelopers, setMockDevelopers] = useState<Developer[]>([
    {
      codigoDesarrollador: 1,
      nombre: 'Juan Pérez',
      rut: '12345678-9',
      correoElectronico: 'juan.perez@email.com',
      fechaContratacion: '2023-01-15T00:00:00',
      aniosExperiencia: 5,
      registroActivo: true,
    },
    {
      codigoDesarrollador: 2,
      nombre: 'María González',
      rut: '98765432-1',
      correoElectronico: 'maria.gonzalez@email.com',
      fechaContratacion: '2022-06-10T00:00:00',
      aniosExperiencia: 3,
      registroActivo: true,
    },
    {
      codigoDesarrollador: 3,
      nombre: 'Carlos López',
      rut: '11223344-5',
      correoElectronico: 'carlos.lopez@email.com',
      fechaContratacion: '2021-03-20T00:00:00',
      aniosExperiencia: 7,
      registroActivo: false,
    },
  ]);

  const developers = mockDevelopers;

  const filteredDevelopers = developers.filter(dev =>
    dev.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.rut.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateDeveloper = (formData: DeveloperFormData) => {
    const newDeveloper: Developer = {
      codigoDesarrollador: Math.max(...mockDevelopers.map(d => d.codigoDesarrollador)) + 1,
      ...formData,
      fechaContratacion: formData.fechaContratacion + 'T00:00:00',
      registroActivo: true,
    };

    setMockDevelopers(prev => [...prev, newDeveloper]);
    alert('¡Desarrollador creado exitosamente!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Desarrolladores</h1>
          <p className="text-slate-600">
            Gestiona la información de los desarrolladores del equipo
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo desarrollador
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar desarrolladores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-3xl font-bold text-slate-900 mb-2">
            {filteredDevelopers.length}
          </div>
          <p className="text-sm text-slate-600">Total desarrolladores</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {filteredDevelopers.filter(d => d.registroActivo).length}
          </div>
          <p className="text-sm text-slate-600">Desarrolladores activos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {Math.round(
              filteredDevelopers.reduce((acc, d) => acc + d.aniosExperiencia, 0) / 
              filteredDevelopers.length || 0
            )}
          </div>
          <p className="text-sm text-slate-600">Años promedio experiencia</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  RUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha Contratación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Experiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredDevelopers.map((developer) => (
                <tr key={developer.codigoDesarrollador} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {developer.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {formatRUT(developer.rut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {developer.correoElectronico}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {formatDate(developer.fechaContratacion)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {developer.aniosExperiencia} años
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      developer.registroActivo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {developer.registroActivo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className={`p-2 rounded-full hover:bg-slate-100 ${
                        developer.registroActivo 
                          ? 'text-red-400 hover:text-red-600' 
                          : 'text-green-400 hover:text-green-600'
                      }`}>
                        {developer.registroActivo ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <DeveloperFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDeveloper}
      />
    </div>
  );
}
