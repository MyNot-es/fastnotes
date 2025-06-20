# 🗒️ FastNotes

Una aplicación de notas en tiempo real que permite crear y compartir notas instantáneamente mediante URLs únicas.

## 🚀 Características

- ✍️ Crear notas con identificador único (UUID v4)
- 🔄 Sincronización en tiempo real
- 💾 Guardado automático
- 🌙 Modo oscuro
- 📱 Diseño responsivo
- 🔗 URLs compartibles
- 📋 Copiar al portapapeles con un clic

## 🛠️ Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Firebase Realtime Database
- React Router v6

## ⚙️ Configuración del Proyecto

### Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Una cuenta de Firebase

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd fastnotes
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (ver siguiente sección)

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🔐 Configuración de Variables de Entorno

### Desarrollo Local

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Añade las siguientes variables con los valores de tu proyecto Firebase:

```bash
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_DB_URL=https://tu_proyecto.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

⚠️ **IMPORTANTE: Configuración de la URL de Firebase Database**

Para que la aplicación funcione correctamente, es CRÍTICO que `VITE_FIREBASE_DB_URL` esté configurada con la URL exacta de tu base de datos en Firebase. Para encontrar la URL correcta:

1. Ve a la [Consola de Firebase](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en "Realtime Database"
4. En la parte superior verás la URL de tu base de datos (ejemplo: `https://tu-proyecto.firebaseio.com`)
5. Copia esta URL **exactamente como aparece** y úsala como valor para `VITE_FIREBASE_DB_URL`

Si la URL no coincide exactamente, la aplicación no podrá conectarse a la base de datos y las notas no se guardarán.

### Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. En la configuración del proyecto en Vercel:
   - Ve a "Settings" > "Environment Variables"
   - Añade las mismas variables de entorno listadas arriba
   - **CRÍTICO**: Asegúrate de que `VITE_FIREBASE_DB_URL` coincida EXACTAMENTE con la URL de tu base de datos en Firebase
   - Verifica dos veces la URL antes de guardar los cambios
   - Si necesitas actualizar la URL, después del cambio deberás redesplegar la aplicación

> ⚠️ **Importante**: 
> - Nunca comitees el archivo `.env.local` al repositorio. Ya está incluido en `.gitignore` por seguridad.
> - Si la aplicación no guarda las notas en producción, lo primero que debes verificar es que `VITE_FIREBASE_DB_URL` en Vercel coincida con la URL de tu base de datos en Firebase.

## 🔥 Configuración de Firebase

1. Crea un nuevo proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita "Realtime Database"
3. En las reglas de la base de datos, configura los permisos de lectura/escritura:

```json
{
  "rules": {
    "notes": {
      "$noteId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

## 📦 Construcción y Despliegue

### Construcción Local

```bash
npm run build
```

### Despliegue Automático

El proyecto está configurado para desplegarse automáticamente en Vercel con cada push a la rama principal.

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Comitea tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
