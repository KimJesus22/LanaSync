import { LayoutDashboard, ArrowRightLeft, Settings, BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const Navbar = () => {
    const navItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Movimientos',
            path: '/dashboard/movimientos',
            icon: ArrowRightLeft,
        },
        {
            name: 'Estadísticas',
            path: '/dashboard/estadisticas',
            icon: BarChart3,
        },
        {
            name: 'Configuración',
            path: '/dashboard/configuracion',
            icon: Settings,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-800 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) =>
                                cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                    isActive ? "text-primary" : "text-muted hover:text-gray-300"
                                )
                            }
                        >
                            <Icon size={24} />
                            <span className="text-xs font-medium">{item.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
