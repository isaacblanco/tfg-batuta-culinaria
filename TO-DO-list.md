Temas pendientes:

=== FRONTEND ===

- Pantalla de Recetas
  - Lista de recetas
  - Enlace a la receta --> routerLink con ID
  - Mejorar la card de receta
- Pantalla agenda
  - Lista de la semana
- Pantalla lista de la compra
  - Lista de la compra por recetas
  - Lista de la compra por ingredientes
- Pantalla favoritos

  - Lista de recetas
  - Filtrar recetas

- Pantalla IA

  - Formulario de IA
  -

- Pantalla de nueva receta
  - Formulario de receta: al guardar, debe cogerse el ID de la receta y redirigir a la pantalla de la receta con el ID

=== API ===

- Poder authenticarse
- Poder registrar usuario
- Poder crear receta
- Poder ver receta
- Poder ver lista de la compra
- Poder ver agenda
- Poder usar IA

-- Uso de google para autenticar
https://supabase.com/dashboard/project/ilybvqaifwjyrtislcqt/auth/providers

Template de email
https://supabase.com/dashboard/project/ilybvqaifwjyrtislcqt/email/templates

-- Seguridad en la base de datos y api : PARA NOTA
https://youtu.be/pi33WDrgfpI?t=636 --> Enable RLS es un punto extra

-- Seguridad en el registro de contraseñas
https://supabase.com/dashboard/project/ilybvqaifwjyrtislcqt/settings/auth

Explicar que se debe verificar el email
https://supabase.com/dashboard/project/ilybvqaifwjyrtislcqt/email/verify

-- Poner la aplicación en producción (uso de url en interserver)
https://supabase.com/dashboard/project/ilybvqaifwjyrtislcqt/auth/url-configuration

Cambiar el logotipo de la APP

- Usar un gorro de chef, con la paleta y la espiga de la cava

=== ERRORES A SOLUCIONAR ===

- Al crear la cuenta y luego ir al login, no se crea por defecto en la tabla de usuarios --> forzar en signup
- Pantalla account: borrado de usuario no lo hace en la tabla de Auth.users, aunque si en la de usuarios, revisar
