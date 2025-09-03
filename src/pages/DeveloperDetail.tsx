import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Developer } from '@/features/developers/schemas';
import type { Project } from '@/features/projects/schemas';
import { getDevelopers, getProjectsByDeveloper, assignDeveloperToProject, unassignDeveloperFromProject, getProjects } from '@/lib/storage';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    assignDeveloperToProject(developer.codigoDesarrollador, codigoProyecto);
    setAssigned(getProjectsByDeveloper(developer.codigoDesarrollador));
    addToast({ type: 'success', title: 'Desarrollador asignado', message: 'El desarrollador se asignó al proyecto correctamente' });
  };

  const handleUnassign = (codigoProyecto: number) => {
    unassignDeveloperFromProject(developer.codigoDesarrollador, codigoProyecto);
    setAssigned(getProjectsByDeveloper(developer.codigoDesarrollador));
    addToast({ type: 'info', title: 'Desarrollador desasignado', message: 'El desarrollador se desasignó del proyecto correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/developers" className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{developer.nombre}</h1>
          <p className="text-gray-600">{developer.correoElectronico} • {developer.rut}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del desarrollador */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Información</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-slate-600">Fecha de contratación</dt>
              <dd className="text-sm text-slate-900">{new Date(developer.fechaContratacion).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">Años de experiencia</dt>
              <dd className="text-sm text-slate-900">{developer.aniosExperiencia} años</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">Estado</dt>
              <dd>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  developer.registroActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {developer.registroActivo ? 'Activo' : 'Inactivo'}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Proyectos asignados */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Proyectos asignados ({assigned.length})</h3>
          {assigned.length === 0 ? (
            <p className="text-sm text-slate-500">No hay proyectos asignados.</p>
          ) : (
            <ul className="space-y-2">
              {assigned.map(p => (
                <li key={p.codigoProyecto} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-slate-900">{p.nombre}</div>
                    <div className="text-sm text-slate-500">{new Date(p.fechaInicio).toLocaleDateString()}</div>
                  </div>
                  <button 
                    onClick={() => handleUnassign(p.codigoProyecto)} 
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors"
                  >
                    Desasignar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Asignar a proyectos */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Asignar a proyecto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProjects
            .filter(p => !assigned.find(ap => ap.codigoProyecto === p.codigoProyecto))
            .map(p => (
              <div key={p.codigoProyecto} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{p.nombre}</div>
                    <div className="text-sm text-slate-500 mt-1">{new Date(p.fechaInicio).toLocaleDateString()}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleAssign(p.codigoProyecto)} 
                  className="mt-3 w-full px-3 py-2 text-sm text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                >
                  Asignar
                </button>
              </div>
            ))}
        </div>
        {allProjects.filter(p => !assigned.find(ap => ap.codigoProyecto === p.codigoProyecto)).length === 0 && (
          <p className="text-sm text-slate-500">Todos los proyectos ya están asignados.</p>
        )}
      </div>
    </div>
  );
}
