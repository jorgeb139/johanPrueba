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
    assignDeveloperToProject(codigoDesarrollador, project.codigoProyecto);
    setAssigned(getDevelopersByProject(project.codigoProyecto));
    addToast({ type: 'success', title: 'Desarrollador asignado', message: 'El desarrollador se asignó al proyecto correctamente' });
  };

  const handleUnassign = (codigoDesarrollador: number) => {
    unassignDeveloperFromProject(codigoDesarrollador, project.codigoProyecto);
    setAssigned(getDevelopersByProject(project.codigoProyecto));
    addToast({ type: 'info', title: 'Desarrollador desasignado', message: 'El desarrollador se desasignó del proyecto correctamente' });
  };

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
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Desarrolladores asignados</h3>
        {assigned.length === 0 ? (
          <p className="text-sm text-slate-500">No hay desarrolladores asignados.</p>
        ) : (
          <ul className="space-y-2">
            {assigned.map(d => (
              <li key={d.codigoDesarrollador} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{d.nombre}</div>
                  <div className="text-sm text-slate-500">{d.correoElectronico}</div>
                </div>
                <div>
                  <button onClick={() => handleUnassign(d.codigoDesarrollador)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">Desasignar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Asignar desarrolladores</h3>
        <ul className="space-y-2">
          {allDevelopers.map(d => (
            <li key={d.codigoDesarrollador} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">{d.nombre}</div>
                <div className="text-sm text-slate-500">{d.correoElectronico}</div>
              </div>
              <div>
                <button onClick={() => handleAssign(d.codigoDesarrollador)} className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded">Asignar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
