import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AIAssistant from './AIAssistant';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background text-text pb-20">
            <main className="container mx-auto px-4 py-6 max-w-md">
                <Outlet />
            </main>
            <AIAssistant />
            <Navbar />
        </div>
    );
};

export default Layout;
