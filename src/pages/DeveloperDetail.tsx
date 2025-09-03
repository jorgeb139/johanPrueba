import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Developer } from '@/features/developers/schemas';
import type { Project } from '@/features/projects/schemas';
import { getDevelopers, getProjectsByDeveloper, assignDeveloperToProject, unassignDeveloperFromProject, getProjects } from '@/lib/storage';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, User, Mail, Calendar, Award } from 'lucide-react';

export default function DeveloperDetailPage() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [assigned, setAssigned] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    const devs = getDevelopers();
    const found = devs.find(d => d.codigoDesarrollador === Number(id));
    setDeveloper(found ?? null);
    setAssigned(getProjectsByDeveloper(Number(id)));
    setAllProjects(getProjects());
  }, [id]);

  if (!developer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Desarrollador no encontrado.</p>
      </div>
    );
  }

  const handleAssign = (codigoProyecto: number) => {
    const project = getProjects().find(p => p.codigoProyecto === codigoProyecto);
    
    // Validar que tanto el desarrollador como el proyecto estén activos
    if (!developer.registroActivo) {
      addToast({ type: 'error', title: 'Error', message: 'No se puede asignar proyectos a un desarrollador inactivo' });
      return;
    }
    
    if (!project?.registroActivo) {
      addToast({ type: 'error', title: 'Error', message: 'No se puede asignar un proyecto inactivo' });
      return;
    }
    
    assignDeveloperToProject(developer.codigoDesarrollador, codigoProyecto);
    setAssigned(getProjectsByDeveloper(developer.codigoDesarrollador));
    addToast({ type: 'success', title: 'Proyecto asignado', message: 'El proyecto se asignó al desarrollador correctamente' });
  };

  const handleUnassign = (codigoProyecto: number) => {
    // Validar que el desarrollador esté activo para poder desasignar
    if (!developer.registroActivo) {
      addToast({ type: 'error', title: 'Error', message: 'No se pueden desasignar proyectos de un desarrollador inactivo' });
      return;
    }
    
    unassignDeveloperFromProject(developer.codigoDesarrollador, codigoProyecto);
    setAssigned(getProjectsByDeveloper(developer.codigoDesarrollador));
    addToast({ type: 'info', title: 'Proyecto desasignado', message: 'El proyecto se desasignó del desarrollador correctamente' });
  };

  const available = allProjects
    .filter(p => p.registroActivo) // Solo proyectos activos
    .filter(p => !assigned.find(ap => ap.codigoProyecto === p.codigoProyecto));

  return (
    <div className="space-y-6">
      <div>
        <Link to="/developers" className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a desarrolladores
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          {developer.nombre}
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            developer.registroActivo 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {developer.registroActivo ? 'Activo' : 'Inactivo'}
          </span>
        </h1>
      </div>

      {/* Información del desarrollador */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">RUT:</span>
            <span className="font-medium">{developer.rut}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Email:</span>
            <span className="font-medium">{developer.correoElectronico}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Contratación:</span>
            <span className="font-medium">{new Date(developer.fechaContratacion).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Experiencia:</span>
            <span className="font-medium">{developer.aniosExperiencia} años</span>
          </div>
        </div>
      </div>

      {/* Proyectos asignados */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Proyectos Asignados ({assigned.length})</h3>
        {assigned.length === 0 ? (
          <p className="text-sm text-slate-500">No hay proyectos asignados.</p>
        ) : (
          <div className="space-y-2">
            {assigned.map(p => (
              <div key={p.codigoProyecto} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div>
                  <h4 className="font-medium text-slate-900">{p.nombre}</h4>
                  <p className="text-sm text-slate-500">
                    {new Date(p.fechaInicio).toLocaleDateString()} — {new Date(p.fechaTermino).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    p.registroActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {p.registroActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <button
                  onClick={() => handleUnassign(p.codigoProyecto)}
                  disabled={!developer.registroActivo}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Desasignar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proyectos disponibles */}
      {available.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Proyectos Disponibles ({available.length})</h3>
          <div className="space-y-2">
            {available.map(p => (
              <div key={p.codigoProyecto} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div>
                  <h4 className="font-medium text-slate-900">{p.nombre}</h4>
                  <p className="text-sm text-slate-500">
                    {new Date(p.fechaInicio).toLocaleDateString()} — {new Date(p.fechaTermino).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleAssign(p.codigoProyecto)}
                  disabled={!developer.registroActivo}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Asignar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!developer.registroActivo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Desarrollador Inactivo
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Este desarrollador está inactivo. No se pueden realizar asignaciones o desasignaciones de proyectos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
