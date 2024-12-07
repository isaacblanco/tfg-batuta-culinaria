Temas pendientes:

=== FRONTEND ===

- Pantalla de receta
  - Agregar las opciones asociadas a la receta
    - Agregar a lista de la compra
    - Empezar a seguir la receta
- Pantalla de Recetas
  - Mejorar la card de receta
- Pantalla agenda
  - Lista de la semana, separada por días
    - Mostrar en la cabecera el día de la semana y la fecha
    - Usar el deslizar para eliminar una receta de la agenda
    - Opcion para mover entre díass
  - Incorporar un botón para eliminar una receta de la agenda
- Pantalla lista de la compra
  - Lista de la compra por recetas
  - Lista de la compra por ingredientes
  - Usar el local storage para guardar la lista de la compra
  - Poner un botón para vaciar la lista de la compra
  - Incorporar un botón para eliminar una receta de la lista de la compra
  - Poner un botón de compartir lista de la compra
    - Ver como se puede compartir
- Pantalla de seguimiento de una receta

  - Mostrar los pasos de la receta
  - Incorporar el temporizador

- Pantalla IA

  - Formulario de IA
  - Probar contra el servidor interno de Jan
    - Hacer funcionar el servidor interno de Jan
    - Probar desde el frontend

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

=== MOBILES ===

- Montar una distribución en la nube
  - Usar el servidor de interserver
  - Probar en los moviles
  - Revisa la parte de base en el index.html, no debe apuntar al \
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
