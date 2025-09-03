import { Link } from 'react-router-dom';
import { Users, FolderOpen, Plus, Activity, Eye, TrendingUp } from 'lucide-react';
import type { Developer } from '@/features/developers/schemas';
import type { Project } from '@/features/projects/schemas';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { getDevelopers, getProjects, saveDevelopers, saveProjects } from '@/lib/storage';
import DeveloperFormModal, { type DeveloperFormData } from '@/components/DeveloperFormModal';
import ProjectFormModal, { type ProjectFormData } from '@/components/ProjectFormModal';

export default function DashboardPage() {
  const { addToast } = useToast();
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    setDevelopers(getDevelopers());
    setProjects(getProjects());
  }, []);

  const activeDevelopers = developers.filter(d => d.registroActivo);
  const activeProjects = projects.filter(p => p.registroActivo);

  const getProjectStatus = (project: Project) => {
    const now = new Date();
    const startDate = new Date(project.fechaInicio);
    const endDate = new Date(project.fechaTermino);
    
    if (!project.registroActivo) return 'Inactivo';
    if (now < startDate) return 'Por iniciar';
    if (now > endDate) return 'Finalizado';
    return 'En progreso';
  };

  const projectsInProgress = activeProjects.filter(p => getProjectStatus(p) === 'En progreso').length;

  const handleCreateDeveloper = (formData: DeveloperFormData) => {
    const newDeveloper: Developer = {
      codigoDesarrollador: Math.max(0, ...developers.map(d => d.codigoDesarrollador)) + 1,
      ...formData,
      fechaContratacion: formData.fechaContratacion + 'T00:00:00',
      registroActivo: true,
    };

    const updatedDevelopers = [...developers, newDeveloper];
    setDevelopers(updatedDevelopers);
    saveDevelopers(updatedDevelopers);
    addToast({ type: 'success', title: 'Desarrollador creado', message: '¡Desarrollador creado exitosamente!' });
  };

  const handleCreateProject = (formData: ProjectFormData) => {
    const newProject: Project = {
      codigoProyecto: Math.max(0, ...projects.map(p => p.codigoProyecto)) + 1,
      ...formData,
      fechaInicio: formData.fechaInicio + 'T00:00:00',
      fechaTermino: formData.fechaTermino + 'T00:00:00',
      registroActivo: true,
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    addToast({ type: 'success', title: 'Proyecto creado', message: '¡Proyecto creado exitosamente!' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">
          Gestión de desarrolladores y proyectos
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Desarrolladores</p>
              <p className="text-3xl font-bold text-slate-900">{developers.length}</p>
            </div>
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Activos en el sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Proyectos</p>
              <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mt-2">En desarrollo</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Desarrolladores Activos</p>
              <p className="text-3xl font-bold text-green-600">{activeDevelopers.length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Con asignaciones</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Proyectos Activos</p>
              <p className="text-3xl font-bold text-blue-600">{projectsInProgress}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-xs text-slate-500 mt-2">En ejecución</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Desarrolladores</h3>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-6">
            Gestiona la información de los desarrolladores del equipo
          </p>
          <div className="flex space-x-3">
            <Link 
              to="/developers"
              className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver todos
            </Link>
            <button 
              onClick={() => setIsDeveloperModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo desarrollador
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Proyectos</h3>
            <FolderOpen className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-6">
            Administra los proyectos y sus asignaciones
          </p>
          <div className="flex space-x-3">
            <Link 
              to="/projects"
              className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver todos
            </Link>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo proyecto
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de actividad reciente */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen de Desarrolladores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDevelopers.slice(0, 3).map((developer) => (
            <div key={developer.codigoDesarrollador} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">{developer.nombre}</h4>
                  <p className="text-sm text-slate-600">{developer.correoElectronico}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {developer.aniosExperiencia} años de experiencia
                  </p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modales */}
      <DeveloperFormModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
        onSubmit={handleCreateDeveloper}
      />
      
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
