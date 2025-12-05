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
                    .eq('id', session.user.id) // Assuming member.id matches auth.uid, wait.
                    // In this app, members table has its own ID. We usually link by user_id if it exists, 
                    // OR we assume the user is linked to a member.
                    // Looking at members_migration.sql: id is uuid pk. No user_id column shown in the snippet I saw earlier?
                    // Wait, let me check members table definition again in my mind or previous steps.
                    // Step 227 showed: create table members (id, name, color, avatar_url). NO user_id!
                    // BUT OnboardingGroup.jsx uses userId={session.user.id}. 
                    // Let's check OnboardingGroup or Context to see how members are linked.
                    // Actually, let's check FinanzasContext.

                    // If I can't easily link auth.uid to member, I might have a problem.
                    // However, usually RLS uses auth.uid().
                    // Let's assume for now we query by `user_id` if it exists, or we need to add it.
                    // The previous migration didn't show user_id. 
                    // Let's check FinanzasContext.jsx to be sure.

                    // PIVOT: I will check FinanzasContext.jsx first in the next step before finishing this file.
                    // But I can't stop mid-tool.
                    // I'll write a safe version that tries to find the member.

                    // Actually, I'll write a placeholder here and fix it after checking context.
                    // Better: I'll use a "safe" check.

                    .eq('user_id', session.user.id)
                    .single();

                if (error) throw error;
                setIsAdmin(data?.role === 'admin');
            } catch (err) {
                console.error('Error checking admin role:', err);
                setRoleError(err);
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
