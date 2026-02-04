# NestJS Clean Architecture Starter 🚀

Bienvenido a esta **fundación sólida y escalable** para proyectos de backend con NestJS. Este repositorio no es solo una base de código; es una herramienta de software diseñada bajo los principios de **Clean Architecture**, optimizada para desarrolladores que buscan un punto de partida profesional, mantenible y con una estructura de la que me siento orgulloso de compartir.

## 🌟 Filosofía del Proyecto

Esta estructura nace de la búsqueda de un estándar que resuelva los problemas comunes de acoplamiento y falta de escalabilidad en proyectos modernos. Tras iterar y trabajar en diversos entornos, he consolidado esta base que considero **altamente confiable y ergonómica**.

La meta es permitir que el desarrollador se enfoque en lo que realmente importa: **la lógica de negocio**, delegando los detalles de infraestructura a capas externas fácilmente intercambiables.

## ✨ Características Principales

- **Clean Architecture Pura:** Separación estricta de responsabilidades entre Dominio, Aplicación e Infraestructura.
- **Independencia de Persistencia:** Sistema preparado para inyectar múltiples implementaciones de repositorios (ej. MongoDB y PostgreSQL simultáneamente) mediante inversión de dependencias.
- **Documentación con Scalar:** Interfaz de API Reference moderna, interactiva y con generación automática de **Client Libraries** en múltiples lenguajes.
- **Gestión Global de Excepciones:** Filtro de errores estandarizado que devuelve códigos de rastreo (`tracking codes`) y timestamps para facilitar el debug en producción.
- **Decoradores de Productividad:** Incluye el decorador personalizado `@ApiDocs` que unifica la documentación de endpoints, parámetros, esquemas de éxito y error en una sola línea.
- **Validación Robusta:** Uso de DTOs con `class-validator` integrados automáticamente en la documentación de Swagger/Scalar.

---

## 🏗️ Estructura de Capas

El proyecto está organizado para proteger el núcleo del negocio:

1.  **Domain:** Contiene las entidades, interfaces de repositorios y reglas de negocio. Es el corazón del sistema y no depende de nada externo.
2.  **Application:** Servicios y casos de uso que orquestan la lógica del dominio.
3.  **Infrastructure:** Implementaciones concretas (MongoUserRepository, PostgresUserRepository, adaptadores de JWT, etc.).
4.  **Interface (Presentation):** Controladores, DTOs y configuración de la API. Aquí es donde vive la magia de la documentación.

---

## 🚀 Instalación y Despliegue

### 1. Clonar y Preparar

```bash
git clone [https://github.com/tu-usuario/nombre-del-repo.git](https://github.com/tu-usuario/nombre-del-repo.git)
cd nombre-del-repo
npm install
```
