-- DIAGNÓSTICO: Ejecuta esto para ver qué está pasando

-- 1. Ver si el usuario existe en Auth
SELECT id, email, created_at FROM auth.users WHERE email = 'adminuser@gmail.com';

-- 2. Ver si el miembro existe en Public
SELECT user_id, name, role, group_id FROM public.members 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'adminuser@gmail.com');

-- 3. Ver la estructura de la tabla members (para confirmar si group_id es nullable)
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'members';
