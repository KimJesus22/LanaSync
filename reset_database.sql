-- ⚠️ PELIGRO: ESTE SCRIPT BORRA TODOS LOS DATOS DE USUARIOS ⚠️

-- 1. Limpiar tablas públicas (Datos de usuario)
TRUNCATE TABLE public.transactions CASCADE;
TRUNCATE TABLE public.budgets CASCADE;
TRUNCATE TABLE public.recurring_expenses CASCADE;
TRUNCATE TABLE public.savings_goals CASCADE;
TRUNCATE TABLE public.members CASCADE;
TRUNCATE TABLE public.groups CASCADE;

-- 2. Borrar usuarios de autenticación (Supabase Auth)
-- Esto borrará todos los logins.
DELETE FROM auth.users;

-- 3. (Opcional) Si quieres mantener SOLO al admin, usa esto EN LUGAR del paso 2:
-- DELETE FROM auth.users WHERE email != 'adminuser@gmail.com';

-- NOTA: Después de ejecutar esto, tendrás una app vacía.
-- Deberás volver a ejecutar 'create_admin_user.sql' o 'manual_admin_setup.sql'
-- para recrear tu usuario Admin.
