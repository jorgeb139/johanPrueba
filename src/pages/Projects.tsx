import { Plus, Search, Eye, Edit, Trash2, RefreshCw, Users } from 'lucide-react';
import type { Project } from '@/features/projects/schemas';
import { useState } from 'react';
import ProjectFormModal, { type ProjectFormData } from '@/components/ProjectFormModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { getProjects, saveProjects } from '@/lib/storage';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id?: number; isReactivate?: boolean }>({ isOpen: false });
  
  // Datos desde localStorage
  const [mockProjects, setMockProjects] = useState<Project[]>(() => getProjects());

  const projects = mockProjects;

  const filteredProjects = projects.filter(project =>
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectStatus = (project: Project) => {
    const now = new Date();
    const startDate = new Date(project.fechaInicio);
    const endDate = new Date(project.fechaTermino);
    
    if (!project.registroActivo) return 'Inactivo';
    if (now < startDate) return 'Por iniciar';
    if (now > endDate) return 'Finalizado';
    return 'En progreso';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En progreso': return 'bg-blue-100 text-blue-800';
      case 'Por iniciar': return 'bg-yellow-100 text-yellow-800';
      case 'Finalizado': return 'bg-green-100 text-green-800';
      case 'Inactivo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrUpdateProject = (formData: ProjectFormData) => {
    let updatedProjects: Project[];

    if (editingProject) {
      // Actualizar existente
      updatedProjects = mockProjects.map(p => p.codigoProyecto === editingProject.codigoProyecto
        ? { ...p, ...formData, fechaInicio: formData.fechaInicio + 'T00:00:00', fechaTermino: formData.fechaTermino + 'T00:00:00' }
        : p
      );
      setEditingProject(null);
      addToast({ type: 'success', title: 'Proyecto actualizado', message: 'El proyecto se actualizó correctamente' });
    } else {
      // Crear nuevo
      const nextId = mockProjects.length ? Math.max(...mockProjects.map(p => p.codigoProyecto)) + 1 : 1;
      const newProject: Project = {
        codigoProyecto: nextId,
        ...formData,
        fechaInicio: formData.fechaInicio + 'T00:00:00',
        fechaTermino: formData.fechaTermino + 'T00:00:00',
        registroActivo: true,
      };

      updatedProjects = [...mockProjects, newProject];
      addToast({ type: 'success', title: 'Proyecto creado', message: 'El proyecto se creó correctamente' });
    }

    setMockProjects(updatedProjects);
    saveProjects(updatedProjects);
    setIsModalOpen(false);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: number) => {
    const proj = mockProjects.find(p => p.codigoProyecto === id);
    if (!proj) return;
    
    setConfirmModal({
      isOpen: true,
      id,
      isReactivate: !proj.registroActivo
    });
  };

  const handleConfirmToggle = () => {
    if (!confirmModal.id) return;
    
    const updatedProjects = mockProjects.map(p => 
      p.codigoProyecto === confirmModal.id 
        ? { ...p, registroActivo: !p.registroActivo } 
        : p
    );
    
    setMockProjects(updatedProjects);
    saveProjects(updatedProjects);
    
    const action = confirmModal.isReactivate ? 'reactivado' : 'desactivado';
    addToast({
      type: confirmModal.isReactivate ? 'success' : 'warning',
      title: `Proyecto ${action}`,
      message: `El proyecto ha sido ${action} correctamente`
    });
    
    setConfirmModal({ isOpen: false });
  };

  const handleView = (id: number) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Proyectos</h1>
          <p className="text-slate-600">
            Gestiona los proyectos y sus asignaciones de desarrolladores
          </p>
        </div>
        <button 
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo proyecto
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-3xl font-bold text-slate-900 mb-2">
            {filteredProjects.length}
          </div>
          <p className="text-sm text-slate-600">Total proyectos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {filteredProjects.filter(p => getProjectStatus(p) === 'En progreso').length}
          </div>
          <p className="text-sm text-slate-600">En progreso</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {filteredProjects.filter(p => getProjectStatus(p) === 'Finalizado').length}
          </div>
          <p className="text-sm text-slate-600">Finalizados</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {filteredProjects.filter(p => getProjectStatus(p) === 'Por iniciar').length}
          </div>
          <p className="text-sm text-slate-600">Por iniciar</p>
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
                  Nombre del Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha Término
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Desarrolladores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredProjects.map((project) => {
                const status = getProjectStatus(project);
                return (
                  <tr key={project.codigoProyecto} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {project.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(project.fechaInicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(project.fechaTermino)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {Math.floor(Math.random() * 5) + 1} dev{Math.floor(Math.random() * 5) + 1 > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleView(project.codigoProyecto)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEditClick(project)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleToggleActive(project.codigoProyecto)} className={`p-2 rounded-full hover:bg-slate-100 ${
                          project.registroActivo 
                            ? 'text-red-400 hover:text-red-600' 
                            : 'text-green-400 hover:text-green-600'
                        }`}>
                          {project.registroActivo ? (
                            <Trash2 className="h-4 w-4" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Vista de cards para pantallas pequeñas y medianas */}
        <div className="xl:hidden">
          {filteredProjects.map((project) => {
            const status = getProjectStatus(project);
            const statusColors = {
              'En progreso': 'bg-blue-100 text-blue-800',
              'Finalizado': 'bg-green-100 text-green-800',
              'Por iniciar': 'bg-yellow-100 text-yellow-800',
              'Inactivo': 'bg-red-100 text-red-800'
            };
            
            return (
              <div key={project.codigoProyecto} className="border-b border-slate-200 last:border-b-0 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900">{project.nombre}</h3>
                    <p className="text-sm text-slate-600">
                      {formatDate(project.fechaInicio)} - {formatDate(project.fechaTermino)}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
                    {status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-slate-500">Estado:</span>
                    <span className={`ml-1 font-medium ${
                      project.registroActivo ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {project.registroActivo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Desarrolladores:</span>
                    <span className="ml-1 font-medium">{Math.floor(Math.random() * 5) + 1}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(project.codigoProyecto)}
                    className="inline-flex items-center px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </button>
                  <button
                    onClick={() => handleEditClick(project)}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(project.codigoProyecto)}
                    className={`inline-flex items-center px-3 py-1 text-sm rounded ${
                      project.registroActivo
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {project.registroActivo ? (
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
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }}
        onSubmit={handleCreateOrUpdateProject}
        initialData={editingProject ? {
          nombre: editingProject.nombre,
          fechaInicio: editingProject.fechaInicio.replace('T00:00:00', ''),
          fechaTermino: editingProject.fechaTermino.replace('T00:00:00', ''),
        } : null}
        title={editingProject ? 'Editar Proyecto' : undefined}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmToggle}
        title={confirmModal.isReactivate ? 'Reactivar Proyecto' : 'Desactivar Proyecto'}
        message={confirmModal.isReactivate 
          ? '¿Está seguro que desea reactivar este proyecto?' 
          : '¿Está seguro que desea desactivar este proyecto?'
        }
        confirmText={confirmModal.isReactivate ? 'Reactivar' : 'Desactivar'}
        type={confirmModal.isReactivate ? 'info' : 'warning'}
      />
    </div>
  );
}
