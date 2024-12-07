Temas pendientes:

=== FRONTEND ===

- Pantalla de Recetas
  - Mejorar la card de receta
- Pantalla lista de la compra
  - Poner un botón de compartir lista de la compra
    - Ver como se puede compartir

- Pantalla de nueva receta
  - Formulario de receta: al guardar, debe cogerse el ID de la receta y redirigir a la pantalla de la receta con el ID

=== MOBILES ===

- Montar una distribución en la nube
  - Usar el servidor de interserver
  - Probar en los moviles
  - Revisa la parte de BASE en el index.html, no debe apuntar al \
- Compilar para Android
- Compilar para iOS
  - Probar en un dispositivo físico

=== NOTAS ===

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
- Listado de recetas: limitar las 20 primeras, ordendas por ID descendente??
  - O poner un listado de categorias
    - Y luego filtrar por categoría
    - Ordenar por bloques
