Temas pendientes:

=== Recetas de la IA ===

- Utilizar un sistema externo para generar recetas de la IA
  - Ver como se puede hacer

=== MEJORA EN LA SEGURIDAD DE LA BASE DE DATOS ===

- Usar el RLS para restringir las tablas
- Indicar en la documentación

=== ENTREGA ===

- Mejorar el README.md
  - Explicar la configuración de la aplicación
- Revisar el documento de los anexos, mejorar el formato
- Crear un documento de entrega con el TFG
- Poner el APK en la carpeta de entrega
- Poner el código en la carpeta de entrega

- Subir ficheros a REC --> dar como finalizada la entrega

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
