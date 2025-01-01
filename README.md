# Trabajo de fin de grado - Batuta Culinaria

Isaac Blanco Peco

## Starting the APP

Ir a la carpeta del proyecto 'batuta' y ejecutar:

```
cd batuta
ionic serve
```

Una versión publica de la APP se puede encontrar en: https://batuta.isaacblanco.com/

## Pruebas unitarias

Para ejecutar las pruebas unitarias, ejecutar:

```
cd batuta
npm run test
```

## Configuración del API - Supabase

Utilizandose supabase para la base de datos y el almacenamiento de archivos.

Instalar el cliente de supabase:

```
npm install @supabase/supabase-js
```

## Base de datos

La base de datos se aloja en supabase y se accede a ella desde el proyecto.

## Generando el APK

```
cd batuta
ionic build --prod
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android
npx cap add android
npx cap open android
npx cap sync android
```

Una vez ejecutado por primera vez, las siguientes serían

```
ionic build --prod
npx cap open android
```

### Desde el Android Studio:

Probar en el teléfono:

```
Seleccionar el TLF
Pulsar Play
```

Compilar el .APK en modo debug

```
Menu Build --> Build App Bundle(s) / APK(s) --> Build APK(s)
```