import type { Developer } from '@/features/developers/schemas';
import type { Project } from '@/features/projects/schemas';

const DEV_KEY = 'gp_devs_v1';
const PROJ_KEY = 'gp_projects_v1';
const ASSIGN_KEY = 'gp_assigns_v1';

function safeParse<T>(v: string | null, fallback: T): T {
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function initDefaults() {
  const devs = safeParse<Developer[]>(localStorage.getItem(DEV_KEY), []);
  const projs = safeParse<Project[]>(localStorage.getItem(PROJ_KEY), []);

  if (devs.length === 0) {
    const sample: Developer[] = [
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
    ];
    localStorage.setItem(DEV_KEY, JSON.stringify(sample));
  }

  if (projs.length === 0) {
    const sampleP: Project[] = [
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
    ];
    localStorage.setItem(PROJ_KEY, JSON.stringify(sampleP));
  }

  const assigns = safeParse<Array<{ codigoProyecto: number; codigoDesarrollador: number }>>(localStorage.getItem(ASSIGN_KEY), []);
  if (assigns.length === 0) {
    // sample assignments
    localStorage.setItem(ASSIGN_KEY, JSON.stringify([
      { codigoProyecto: 1, codigoDesarrollador: 1 },
      { codigoProyecto: 1, codigoDesarrollador: 2 },
      { codigoProyecto: 2, codigoDesarrollador: 2 },
    ]));
  }
}

export function getDevelopers(): Developer[] {
  return safeParse<Developer[]>(localStorage.getItem(DEV_KEY), []);
}

export function saveDevelopers(devs: Developer[]) {
  localStorage.setItem(DEV_KEY, JSON.stringify(devs));
}

export function getProjects(): Project[] {
  return safeParse<Project[]>(localStorage.getItem(PROJ_KEY), []);
}

export function saveProjects(projs: Project[]) {
  localStorage.setItem(PROJ_KEY, JSON.stringify(projs));
}

export function getAssignments() {
  return safeParse<Array<{ codigoProyecto: number; codigoDesarrollador: number }>>(localStorage.getItem(ASSIGN_KEY), []);
}

export function saveAssignments(items: Array<{ codigoProyecto: number; codigoDesarrollador: number }>) {
  localStorage.setItem(ASSIGN_KEY, JSON.stringify(items));
}

export function assignDeveloperToProject(codigoDesarrollador: number, codigoProyecto: number) {
  const items = getAssignments();
  const exists = items.find(i => i.codigoDesarrollador === codigoDesarrollador && i.codigoProyecto === codigoProyecto);
  if (!exists) {
    items.push({ codigoDesarrollador, codigoProyecto });
    saveAssignments(items);
  }
}

export function unassignDeveloperFromProject(codigoDesarrollador: number, codigoProyecto: number) {
  let items = getAssignments();
  items = items.filter(i => !(i.codigoDesarrollador === codigoDesarrollador && i.codigoProyecto === codigoProyecto));
  saveAssignments(items);
}

export function getProjectsByDeveloper(codigoDesarrollador: number): Project[] {
  const assigns = getAssignments();
  const projIds = assigns.filter(a => a.codigoDesarrollador === codigoDesarrollador).map(a => a.codigoProyecto);
  const projs = getProjects();
  return projs.filter(p => projIds.includes(p.codigoProyecto));
}

export function getDevelopersByProject(codigoProyecto: number): Developer[] {
  const assigns = getAssignments();
  const devIds = assigns.filter(a => a.codigoProyecto === codigoProyecto).map(a => a.codigoDesarrollador);
  const devs = getDevelopers();
  return devs.filter(d => devIds.includes(d.codigoDesarrollador));
}
