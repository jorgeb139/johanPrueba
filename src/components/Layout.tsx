import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, FolderOpen, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Desarrolladores', href: '/developers', icon: Users },
    { name: 'Proyectos', href: '/projects', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Botón menú para móvil */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                  <span className="text-xl font-bold text-white">GP</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">GestorPro</h1>
                  <p className="text-xs text-slate-500">Sistema de Gestión</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-600">A</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-slate-900">Admin</div>
                  <div className="text-slate-500">admin@gestorpro.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar (overlay + panel) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        {/* overlay */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* panel */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-slate-200 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900">
                <span className="text-sm font-bold text-white">GP</span>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">GestorPro</div>
                <div className="text-xs text-slate-500">Sistema</div>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block"
                >
                  <div
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-sm border-r border-slate-200">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link key={item.name} to={item.href} className="block">
                  <div
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
