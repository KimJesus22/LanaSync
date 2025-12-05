-- PASO 1: Ejecuta esto PRIMERO para arreglar el error de "group_id"
-- Esto permite que el registro normal funcione sin crashear.
ALTER TABLE public.members ALTER COLUMN group_id DROP NOT NULL;

-- PASO 2: Ve a la App (http://localhost:5173/login) y REGÍSTRATE manualmente
-- Crea un usuario con el email: adminuser@gmail.com (o el que quieras)

-- PASO 3: Una vez registrado, EJECUTA esto para hacerte Admin:
UPDATE public.members
SET role = 'admin'
FROM auth.users
WHERE public.members.user_id = auth.users.id
AND auth.users.email = 'adminuser@gmail.com'; -- Cambia esto por tu email si usaste otro

-- Verificación
SELECT name, role FROM public.members 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'adminuser@gmail.com');
