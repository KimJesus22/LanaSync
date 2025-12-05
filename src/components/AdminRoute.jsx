import { Navigate } from 'react-router-dom';
import { useFinanzas } from '../context/FinanzasContext';

const AdminRoute = ({ children }) => {
    const { session } = useFinanzas();
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    if (!session || session.user.email !== adminEmail) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
