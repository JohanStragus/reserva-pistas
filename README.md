# 🏟️ Reserva de Pistas

Aplicación web para la **reserva de pistas deportivas**, desarrollada como proyecto de la **AEA4**.

El objetivo del proyecto es demostrar cómo una aplicación **100% frontend** puede tener persistencia de datos y lógica de backend utilizando un **backend delegado en la nube**.

---

## 🚀 Descripción

La aplicación permite a cualquier usuario:
- Crear reservas de pistas deportivas
- Visualizar las reservas en tiempo real
- Evitar solapamientos de horarios
- Eliminar reservas existentes

El frontend se sirve desde plataformas de hosting estático, mientras que la persistencia y la lógica de datos se gestionan mediante **Firebase Firestore**.

---

## 🧰 Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **Firebase Firestore** (Backend as a Service)
- **Netlify** (despliegue principal)
- **GitHub Pages** (despliegue alternativo)

---

## ✨ Funcionalidades principales

- ✅ Crear reservas indicando pista, fecha y horario  
- ✅ Listado de reservas en tiempo real  
- ✅ Validación de solapamientos de horarios  
- ✅ Eliminación de reservas  
- ✅ Interfaz responsive y moderna  

---

## 🌍 Despliegue

La aplicación está disponible públicamente en:

- **Netlify:**  
  https://gorgeous-manatee-76c325.netlify.app/

- **GitHub Pages:**  
  https://johanstragus.github.io/reserva-pistas/

Ambas URLs sirven el mismo frontend estático conectado al mismo backend en Firebase.

---

## 🔐 Seguridad

Durante el desarrollo, Firestore se encuentra en **modo prueba**, permitiendo el acceso público a la base de datos.

En un entorno de producción, sería necesario:
- Activar reglas de seguridad estrictas
- Implementar autenticación de usuarios
- Limitar accesos por dominio

---

## 🎓 Contexto académico

Proyecto realizado como parte de la **Actividad Avaluable AEA4**, centrada en:
- Despliegue de aplicaciones estáticas
- Uso de backends de terceros (BaaS)
- Integración frontend + servicios en la nube

---

## 👤 Autor

**Johan Stragus**

