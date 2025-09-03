import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Project } from '@/features/projects/schemas';
import type { Developer } from '@/features/developers/schemas';
import { getProjects, getDevelopersByProject, assignDeveloperToProject, unassignDeveloperFromProject, getDevelopers } from '@/lib/storage';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [assigned, setAssigned] = useState<Developer[]>([]);
  const [allDevelopers, setAllDevelopers] = useState<Developer[]>([]);

  const statusInfo = useMemo(() => {
    if (!project) return { status: 'Cargando', color: 'bg-gray-100 text-gray-800' };
    
    const now = new Date();
    const startDate = new Date(project.fechaInicio);
    const endDate = new Date(project.fechaTermino);
    
    if (!project.registroActivo) return { status: 'Inactivo', color: 'bg-red-100 text-red-800' };
    if (now < startDate) return { status: 'Por iniciar', color: 'bg-yellow-100 text-yellow-800' };
    if (now > endDate) return { status: 'Finalizado', color: 'bg-green-100 text-green-800' };
    return { status: 'En progreso', color: 'bg-blue-100 text-blue-800' };
  }, [project]);

  useEffect(() => {
    const projs = getProjects();
    const found = projs.find(p => p.codigoProyecto === Number(id));
    setProject(found ?? null);
    setAssigned(getDevelopersByProject(Number(id)));
    setAllDevelopers(getDevelopers());
  }, [id]);

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Proyecto no encontrado.</p>
      </div>
    );
  }

  const handleAssign = (codigoDesarrollador: number) => {
    const developer = getDevelopers().find(d => d.codigoDesarrollador === codigoDesarrollador);
    
    // Validar que tanto el proyecto como el desarrollador estén activos
    if (!project.registroActivo) {
      addToast({ type: 'error', title: 'Error', message: 'No se pueden asignar desarrolladores a un proyecto inactivo' });
      return;
    }
    
    if (!developer?.registroActivo) {
      addToast({ type: 'error', title: 'Error', message: 'No se puede asignar un desarrollador inactivo' });
      return;
    }
    
    assignDeveloperToProject(codigoDesarrollador, project.codigoProyecto);
    setAssigned(getDevelopersByProject(project.codigoProyecto));
    addToast({ type: 'success', title: 'Desarrollador asignado', message: 'El desarrollador se asignó al proyecto correctamente' });
  };

  const handleUnassign = (codigoDesarrollador: number) => {
    // Validar que el proyecto esté activo para poder desasignar
    if (!project.registroActivo) {
      addToast({ type: 'error', title: 'Error', message: 'No se pueden desasignar desarrolladores de un proyecto inactivo' });
      return;
    }
    
    unassignDeveloperFromProject(codigoDesarrollador, project.codigoProyecto);
    setAssigned(getDevelopersByProject(project.codigoProyecto));
    addToast({ type: 'info', title: 'Desarrollador desasignado', message: 'El desarrollador se desasignó del proyecto correctamente' });
  };

  const available = allDevelopers
    .filter(d => d.registroActivo) // Solo desarrolladores activos
    .filter(d => !assigned.some(assigned => assigned.codigoDesarrollador === d.codigoDesarrollador));

  return (
    <div className="space-y-6">
      <div>
        <Link to="/projects" className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a proyectos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          {project.nombre}
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
            {statusInfo.status}
          </span>
        </h1>
        <p className="text-gray-600">
          <Calendar className="inline h-4 w-4 mr-1" />
          {new Date(project.fechaInicio).toLocaleDateString()} — {new Date(project.fechaTermino).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Desarrolladores Asignados ({assigned.length})</h3>
        {assigned.length === 0 ? (
          <p className="text-sm text-slate-500">No hay desarrolladores asignados.</p>
        ) : (
          <div className="space-y-2">
            {assigned.map(d => (
              <div key={d.codigoDesarrollador} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div>
                  <div className="font-medium text-slate-900">{d.nombre}</div>
                  <div className="text-sm text-slate-500">{d.correoElectronico}</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    d.registroActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {d.registroActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <button
                  onClick={() => handleUnassign(d.codigoDesarrollador)}
                  disabled={!project.registroActivo}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Desasignar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desarrolladores disponibles */}
      {available.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Desarrolladores Disponibles ({available.length})</h3>
          <div className="space-y-2">
            {available.map(d => (
              <div key={d.codigoDesarrollador} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div>
                  <div className="font-medium text-slate-900">{d.nombre}</div>
                  <div className="text-sm text-slate-500">{d.correoElectronico}</div>
                  <div className="text-sm text-slate-400">{d.aniosExperiencia} años de experiencia</div>
                </div>
                <button
                  onClick={() => handleAssign(d.codigoDesarrollador)}
                  disabled={!project.registroActivo}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Asignar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!project.registroActivo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Proyecto Inactivo
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Este proyecto está inactivo. No se pueden realizar asignaciones o desasignaciones de desarrolladores.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
