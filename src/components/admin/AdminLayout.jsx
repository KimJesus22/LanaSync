import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, DollarSign, LogOut, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

const AdminLayout = () => {
    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
        { name: 'Usuarios', path: '/admin/users', icon: Users },
        { name: 'Precios', path: '/admin/pricing', icon: DollarSign },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-700 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center font-bold text-white">
                        A
                    </div>
                    <span className="text-xl font-bold text-white">Backoffice</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                                    )
                                }
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-700 space-y-2">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors"
                    >
                        <Home size={20} />
                        <span className="font-medium">Volver a App</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-900">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
