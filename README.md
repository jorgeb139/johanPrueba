# Sistema de Gestión de Desarrolladores y Proyectos

Aplicación web para gestionar desarrolladores y proyectos con asignaciones many-to-many, construida con React + TypeScript.

## 🚀 Tecnologías

### Obligatorias
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo
- **TailwindCSS** - Framework CSS

### Adicionales (para puntos extra)
- **ShadCN/UI** - Componentes de UI
- **TanStack Query** - Data fetching y caché
- **Zustand** - Estado global de UI
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_API_URL=https://apipruebas3.rbu.cl
VITE_AUTH_TOKEN=tu_token_aqui
```

### API Integration

La aplicación se conecta a:
- **Base URL**: https://apipruebas3.rbu.cl
- **Autenticación**: Bearer token en header `Authorization`

## 📁 Estructura del Proyecto

```
src/
├── api/              # Cliente HTTP y hooks de React Query
│   ├── client.ts     # Configuración de Axios
│   ├── endpoints.ts  # URLs centralizadas
│   └── hooks/        # Custom hooks para data fetching
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes de ShadCN/UI
│   └── Layout.tsx   # Layout principal
├── features/        # Features organizados por dominio
│   ├── developers/  # CRUD de desarrolladores
│   └── projects/    # CRUD de proyectos
├── lib/             # Utilidades
│   ├── utils.ts     # Helpers de ShadCN
│   └── rut.ts       # Validación de RUT chileno
├── pages/           # Páginas de la aplicación
├── store/           # Estado global con Zustand
└── types/           # Tipos TypeScript globales
```

## ✨ Funcionalidades

### ✅ Implementadas
- [x] Configuración inicial del proyecto
- [x] Estructura base de carpetas
- [x] Layout con navegación
- [x] Páginas principales (Dashboard, Desarrolladores, Proyectos)
- [x] Cliente HTTP con interceptores
- [x] Hooks de React Query para data fetching
- [x] Esquemas de validación con Zod
- [x] Estado global de UI con Zustand

### 🚧 En Desarrollo
- [ ] CRUD completo de Desarrolladores
- [ ] CRUD completo de Proyectos  
- [ ] Sistema de asignaciones many-to-many
- [ ] Filtros y búsqueda avanzada
- [ ] Formularios con validación en tiempo real
- [ ] Soft delete y reactivación
- [ ] Notificaciones y manejo de errores
- [ ] Optimistic updates
- [ ] Tablas con paginación y ordenamiento
- [ ] Responsive design completo

## 🎯 Criterios de Evaluación

### Funcionalidad (40%)
- ✅ Configuración inicial
- 🔄 CRUD completo de desarrolladores y proyectos
- 🔄 Sistema de asignaciones bidireccional
- 🔄 Filtros y búsqueda

### Calidad de Código (30%)
- ✅ TypeScript estricto
- ✅ Arquitectura feature-based
- ✅ Separation of concerns
- ✅ Patrones consistentes

### UX/UI (20%)
- ✅ Layout responsive base
- 🔄 Componentes accesibles
- 🔄 Feedback visual (toasts, loaders)
- 🔄 Navegación intuitiva

### Tecnologías (10%)
- ✅ React + TypeScript + Vite ✅
- ✅ TailwindCSS ✅
- ✅ Librerías adicionales ✅

## 🛠 Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Previsualizar build
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🔍 Validaciones

### RUT Chileno
- Validación de dígito verificador
- Formato automático con puntos y guión
- Integrado en formularios con Zod

### Formularios
- Validación en tiempo real
- Mensajes de error contextuales
- Estados de carga y éxito

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Componentes**: Adaptativos según pantalla

## 🎨 UI/UX

### Componentes
- **ShadCN/UI**: Sistema de diseño consistente
- **Lucide Icons**: Iconografía moderna
- **TailwindCSS**: Utilidades CSS

### Estados
- Loading skeletons
- Estados vacíos
- Manejo de errores
- Confirmaciones de acciones

## 🚀 Despliegue

### Netlify/Vercel
```bash
npm run build
# Deploy dist/ folder
```

### Variables de Producción
```env
VITE_API_URL=https://apipruebas3.rbu.cl
VITE_AUTH_TOKEN=production_token
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Proyecto de prueba técnica - Uso académico
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
