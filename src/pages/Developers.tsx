import { Plus, Search, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import type { Developer } from '@/features/developers/schemas';
import { useState } from 'react';
import { formatRUT } from '@/lib/rut';
import DeveloperFormModal, { type DeveloperFormData } from '@/components/DeveloperFormModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { getDevelopers, saveDevelopers } from '@/lib/storage';

export default function DevelopersPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id?: number; isReactivate?: boolean }>({ isOpen: false });
  
  // Datos desde localStorage
  const [mockDevelopers, setMockDevelopers] = useState<Developer[]>(() => getDevelopers());

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

  const handleSaveDeveloper = (formData: DeveloperFormData) => {
    let updatedDevelopers: Developer[];
    
    if (editingDeveloper) {
      // Editar existente
      updatedDevelopers = mockDevelopers.map(d => d.codigoDesarrollador === editingDeveloper.codigoDesarrollador
        ? { ...d, ...formData, fechaContratacion: formData.fechaContratacion + 'T00:00:00' }
        : d
      );
      setEditingDeveloper(null);
      addToast({ type: 'success', title: 'Desarrollador actualizado', message: 'El desarrollador se actualizó correctamente' });
    } else {
      // Crear nuevo
      const nextId = mockDevelopers.length ? Math.max(...mockDevelopers.map(d => d.codigoDesarrollador)) + 1 : 1;
      const newDeveloper: Developer = {
        codigoDesarrollador: nextId,
        ...formData,
        fechaContratacion: formData.fechaContratacion + 'T00:00:00',
        registroActivo: true,
      };

      updatedDevelopers = [...mockDevelopers, newDeveloper];
      addToast({ type: 'success', title: 'Desarrollador creado', message: 'El desarrollador se creó correctamente' });
    }

    setMockDevelopers(updatedDevelopers);
    saveDevelopers(updatedDevelopers);
    setIsModalOpen(false);
  };

  const handleEditClick = (dev: Developer) => {
    setEditingDeveloper(dev);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: number) => {
    const dev = mockDevelopers.find(d => d.codigoDesarrollador === id);
    if (!dev) return;
    
    setConfirmModal({
      isOpen: true,
      id,
      isReactivate: !dev.registroActivo
    });
  };

  const handleConfirmToggle = () => {
    if (!confirmModal.id) return;
    
    const updatedDevelopers = mockDevelopers.map(d => 
      d.codigoDesarrollador === confirmModal.id 
        ? { ...d, registroActivo: !d.registroActivo } 
        : d
    );
    
    setMockDevelopers(updatedDevelopers);
    saveDevelopers(updatedDevelopers);
    
    const action = confirmModal.isReactivate ? 'reactivado' : 'desactivado';
    addToast({
      type: confirmModal.isReactivate ? 'success' : 'warning',
      title: `Desarrollador ${action}`,
      message: `El desarrollador ha sido ${action} correctamente`
    });
    
    setConfirmModal({ isOpen: false });
  };

  const handleView = (id: number) => {
    navigate(`/developers/${id}`);
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
          onClick={() => { setEditingDeveloper(null); setIsModalOpen(true); }}
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Vista de tabla para pantallas muy grandes */}
        <div className="hidden xl:block overflow-x-auto">
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
                      <button onClick={() => handleView(developer.codigoDesarrollador)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEditClick(developer)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleToggleActive(developer.codigoDesarrollador)} className={`p-2 rounded-full hover:bg-slate-100 ${
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

        {/* Vista de cards para pantallas pequeñas y medianas */}
        <div className="xl:hidden">
          {filteredDevelopers.map((developer) => (
            <div key={developer.codigoDesarrollador} className="border-b border-slate-200 last:border-b-0 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-slate-900">{developer.nombre}</h3>
                  <p className="text-sm text-slate-600">{developer.correoElectronico}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  developer.registroActivo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {developer.registroActivo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-slate-500">RUT:</span>
                  <span className="ml-1 font-medium">{formatRUT(developer.rut)}</span>
                </div>
                <div>
                  <span className="text-slate-500">Experiencia:</span>
                  <span className="ml-1 font-medium">{developer.aniosExperiencia} años</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Contratación:</span>
                  <span className="ml-1 font-medium">{formatDate(developer.fechaContratacion)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/developers/${developer.codigoDesarrollador}`}
                  className="inline-flex items-center px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Link>
                <button
                  onClick={() => { setEditingDeveloper(developer); setIsModalOpen(true); }}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(developer.codigoDesarrollador)}
                  className={`inline-flex items-center px-3 py-1 text-sm rounded ${
                    developer.registroActivo
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {developer.registroActivo ? (
                    <>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reactivar
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <DeveloperFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingDeveloper(null); }}
        onSubmit={handleSaveDeveloper}
        initialData={editingDeveloper ? {
          nombre: editingDeveloper.nombre,
          rut: editingDeveloper.rut,
          correoElectronico: editingDeveloper.correoElectronico,
          fechaContratacion: editingDeveloper.fechaContratacion.replace('T00:00:00', ''),
          aniosExperiencia: editingDeveloper.aniosExperiencia,
        } : null}
        title={editingDeveloper ? 'Editar Desarrollador' : undefined}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmToggle}
        title={confirmModal.isReactivate ? 'Reactivar Desarrollador' : 'Desactivar Desarrollador'}
        message={confirmModal.isReactivate 
          ? '¿Está seguro que desea reactivar este desarrollador?' 
          : '¿Está seguro que desea desactivar este desarrollador?'
        }
        confirmText={confirmModal.isReactivate ? 'Reactivar' : 'Desactivar'}
        type={confirmModal.isReactivate ? 'info' : 'warning'}
      />
    </div>
  );
}
