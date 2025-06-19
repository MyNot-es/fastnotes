# 🗒️ Bloc de Notas con Código Único (Actualizado)

---

## TL;DR

Este proyecto es una **Single Page Application (SPA)** desarrollada con **React y Vite**, utilizando **React Router** para la gestión de rutas. Las notas se guardan en **Firebase Realtime Database** y la aplicación está desplegada en **Vercel**.

Puedes acceder a las notas mediante una **URL canónica** `/nota/<UUID>`. No requiere inicio de sesión, cuenta con guardado automático (`autosave`), **modo oscuro** y copiado automático de la URL al portapapeles.

---

## 🎯 Objetivo

Permitir que cualquier usuario tome y comparta una nota **al instante**, desde cualquier dispositivo, usando un **UUID v4** en la URL como identificador único. El enfoque principal es lograr **cero fricción y cero registros**.

---

## 🖼️ Flujo de la aplicación

| Pantalla       | Acción                   | Resultado                                                                                                                                                                                                            |
| :------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Principal** | 1) Crear nota<br>2) Recuperar nota | **Crear nota**: Genera UUID → Guarda estructura inicial en Firebase → Redirige a `/nota/<UUID>`<br>Copia URL automáticamente al portapapeles                                                                    |
|                |                          | **Recuperar nota**: El usuario introduce un código → Valida formato UUID v4 → Redirige a `/nota/<UUID>`<br>Si el código es inválido, muestra un error                                                               |
| **Editor de nota** | Carga contenido desde Firebase → Autosave en cada cambio | Muestra una barra con el código de la nota, un botón para copiar la URL y los `timestamps` de creación/actualización. |

---

## ✨ Funcionalidades

* ✍️ **Crear** nota con código único (**UUID v4**) y redirección automática a URL canónica.
* 📋 **Copiado automático** de la URL al crear una nueva nota.
* 🔍 **Recuperar** nota por código (con validación de UUID v4).
* 💾 **Autosave** en tiempo real (Firebase RTDB).
* ⏱️ **Indicador de estado** (guardando/guardado) en el editor.
* 📅 **Timestamps** de creación y última modificación.
* 🌑 **Modo oscuro** persistente (guardado en `localStorage`).
* 📱 **Responsive** completo (funciona en móvil y escritorio).
* 🔗 **Compartir en un clic** (botón permanente en el editor).
* 🔄 **Persistencia** entre sesiones/dispositivos.

---

## 🧱 Stack

| Capa        | Tecnología               | Por qué                                      |
| :---------- | :----------------------- | :------------------------------------------- |
| Frontend    | React + Vite             | SPA rápida y `DX` moderna                    |
| Routing     | React Router v6          | Manejo de rutas dinámicas (URL canónica)     |
| Estilos     | Tailwind CSS             | Prototipado ágil y `mobile-first`            |
| DB tiempo real | Firebase Realtime DB     | Sincronización instantánea sin backend propio |
| Hosting     | Vercel                   | CI/CD gratuito vía GitHub                    |
| ID único    | UUID v4                  | Colisiones virtualmente imposibles          |
| Gestión estado UI | Context API + Hooks      | Para modo oscuro y otros estados globales    |

---

## ⚙️ Variables de entorno

| Variable                             | Ejemplo                                   | Descripción                      |
| :----------------------------------- | :---------------------------------------- | :------------------------------- |
| `VITE_FIREBASE_API_KEY`              | `AIza...`                                 | Clave pública Firebase           |
| `VITE_FIREBASE_DB_URL`               | `https://<proj>.firebaseio.com`           | URL `RTDB`                       |
| `VITE_FIREBASE_AUTH_DOMAIN`          | `<proj>.firebaseapp.com`                  | Dominio autenticación            |
| `VITE_FIREBASE_PROJECT_ID`           | `my-project`                              | ID proyecto Firebase             |
| `VITE_FIREBASE_STORAGE_BUCKET`       | `<proj>.appspot.com`                      | `Bucket` de almacenamiento       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1234567890`                              | `Sender ID` para mensajería      |
| `VITE_FIREBASE_APP_ID`               | `1:1234567890:web:...`                    | ID aplicación Firebase           |

**Nota**: Todas las variables empiezan por `VITE_` porque Vite expone solo las que siguen ese prefijo.

---

## 🔒 Consideraciones

* **Sin autenticación**: Cualquiera con la URL puede leer/editar la nota.
* **No hay borrado ni listado de notas**.
* **Privacidad básica**: No almacenar datos sensibles.
* **Reglas de seguridad Firebase**:
    * Lectura abierta.
    * Escritura abierta (cualquiera puede editar si tiene la URL).

---

## ✅ Principios de diseño

* **Simplicidad**: Menos de 5 segundos desde que se aterriza en la página hasta que se crea una nota.
* **Rendimiento**: Primera carga menor a 100 KB (`gz`).
* **Acceso universal**: Sin necesidad de pasar por App Stores.
* **Mantenimiento mínimo**: `Stack` 100% `serverless`.
* **URL como llave**: El código UUID es parte de la ruta.

---

## 🚀 Mejoras Recientes Incorporadas

* **URL canónica**:
    * Las notas ahora residen en rutas permanentes: `/nota/<UUID>`.
    * Al crear una nota, se redirige a esta ruta y la URL se copia automáticamente.
* **Recuperación robusta**:
    * Validación estricta de UUID v4 en el campo de recuperación.
* **UX mejorada**:
    * Botón permanente para copiar la URL en el editor.
    * Indicador de estado de guardado.
    * Fechas de creación y modificación visibles.
* **Modo oscuro persistente**:
    * Se recuerda la preferencia del usuario entre sesiones.