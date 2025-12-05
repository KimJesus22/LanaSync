import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFinanzas } from '../../context/FinanzasContext';
import LoadingSpinner from '../LoadingSpinner';

const AdminRoute = ({ children }) => {
    const { session, loading, userGroup } = useFinanzas();

    // We need to fetch the user role from the members table
    // Since useFinanzas doesn't expose role directly yet, we might need to fetch it here or update context.
    // For simplicity and speed, let's assume we'll update useFinanzas or fetch it here.
    // Actually, let's fetch it here for now to avoid touching Context if not needed globally yet.

    const [isAdmin, setIsAdmin] = React.useState(null);
    const [checkingRole, setCheckingRole] = React.useState(true);
    const [roleError, setRoleError] = React.useState(null);

    React.useEffect(() => {
        const checkRole = async () => {
            if (!session?.user?.id) {
                setCheckingRole(false);
                return;
            }

            try {
                const { supabase } = await import('../../supabaseClient');
                const { data, error } = await supabase
                    .from('members')
                    .select('role')
                    .eq('user_id', session.user.id)
                    .single();

                if (error) {
                    console.warn('AdminRoute: Error checking role', error);
                    setIsAdmin(false);
                } else {
                    setIsAdmin(data?.role === 'admin');
                }
            } catch (err) {
                console.error('AdminRoute: Unexpected error:', err);
                setIsAdmin(false);
            } finally {
                setCheckingRole(false);
            }
        };

        checkRole();
    }, [session]);

    if (loading || checkingRole) return <LoadingSpinner />;

    if (!session || !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;
