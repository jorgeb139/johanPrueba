import { Plus, Search, Eye, Edit, Trash2, RefreshCw, Users } from 'lucide-react';
import type { Project } from '@/features/projects/schemas';
import { useState } from 'react';
import ProjectFormModal, { type ProjectFormData } from '@/components/ProjectFormModal';
import { useNavigate } from 'react-router-dom';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Datos de prueba
  const [mockProjects, setMockProjects] = useState<Project[]>([
    {
      codigoProyecto: 1,
      nombre: 'Sistema ERP Empresarial',
      fechaInicio: '2024-01-15T00:00:00',
      fechaTermino: '2024-12-15T00:00:00',
      registroActivo: true,
    },
    {
      codigoProyecto: 2,
      nombre: 'App Mobile Banking',
      fechaInicio: '2024-03-01T00:00:00',
      fechaTermino: '2024-09-30T00:00:00',
      registroActivo: true,
    },
    {
      codigoProyecto: 3,
      nombre: 'Portal E-commerce',
      fechaInicio: '2023-06-10T00:00:00',
      fechaTermino: '2024-02-28T00:00:00',
      registroActivo: false,
    },
    {
      codigoProyecto: 4,
      nombre: 'Sistema de Inventario',
      fechaInicio: '2024-05-20T00:00:00',
      fechaTermino: '2024-11-20T00:00:00',
      registroActivo: true,
    },
  ]);

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
    if (editingProject) {
      // Actualizar existente
      setMockProjects(prev => prev.map(p => p.codigoProyecto === editingProject.codigoProyecto
        ? { ...p, ...formData, fechaInicio: formData.fechaInicio + 'T00:00:00', fechaTermino: formData.fechaTermino + 'T00:00:00' }
        : p
      ));
      setEditingProject(null);
      alert('¡Proyecto actualizado exitosamente!');
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

      setMockProjects(prev => [...prev, newProject]);
      alert('¡Proyecto creado exitosamente!');
    }

    setIsModalOpen(false);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: number) => {
    const proj = mockProjects.find(p => p.codigoProyecto === id);
    if (!proj) return;
    const confirmMsg = proj.registroActivo ? '¿Eliminar (soft delete) el proyecto?' : '¿Reactivar el proyecto?';
    if (!window.confirm(confirmMsg)) return;

    setMockProjects(prev => prev.map(p => p.codigoProyecto === id ? { ...p, registroActivo: !p.registroActivo } : p));
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
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
    </div>
  );
}
