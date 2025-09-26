-- Atualizar roles dos usuários existentes baseado no campo isAdmin
UPDATE users 
SET role = CASE 
  WHEN "isAdmin" = true THEN 'ADMIN'::"UserRole"
  ELSE 'USER'::"UserRole"
  END
WHERE role IS NULL;