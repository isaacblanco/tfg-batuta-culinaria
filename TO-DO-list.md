Temas pendientes:

=== FRONTEND ===

- Editar receta:
  - Confirmar que el formulario de receta funciona correctamente
  - Formulario de receta: al guardar, debe cogerse el ID de la receta y redirigir a la pantalla de la receta con el ID

- Pantalla de Recetas
  - Mejorar la card de receta

- Pantalla lista de la compra
  - Poner un botón de compartir lista de la compra
    - Ver como se puede compartir

=== Recetas de la IA ===

- Utilizar un sistema externo para generar recetas de la IA
  - Ver como se puede hacer

=== Pruebas unitarias ===

- Crear pruebas unitarias de la API
- Crear pruebas unitarias de la aplicación


- Actualizar el TFG con las pruebas unitarias
  - Punto 4.8.3 Estrategia de pruebas
    - Hay que razonar porque se han hecho las pruebas que se han hecho, justificación
- Montar un ejemplo de como se lanzan las pruebas unitarias
- Punto 4.8.4 Resultados de las pruebas
  - Hay que poner los resultados de las pruebas
  

=== MOBILES ===

- Montar una distribución en la nube
  - Usar el servidor de interserver
  - Probar en los moviles
  - Revisa la parte de BASE en el index.html, no debe apuntar al \

APK
- Compilar para Android
  - Usar una clave de firma para el APK sin restringir
  - Probar en un dispositivo físico
- Compilar para iOS (lo ultimo)
  - Probar en un dispositivo físico

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
