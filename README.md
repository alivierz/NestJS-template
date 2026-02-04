# NestJS Clean Architecture Template 🚀

Este es un **template base** diseñado bajo los principios de **Clean Architecture** y **Hexagonal Architecture**. Está pensado para desarrolladores que buscan una base de código profesional, desacoplada y altamente escalable para proyectos en NestJS.

## 🌟 ¿Por qué usar este template?

Tras trabajar con diversas estructuras, he consolidado este boilerplate que resuelve el acoplamiento común entre la lógica de negocio y las herramientas externas. Es una base que me ha resultado extremadamente cómoda y sólida para proyectos de cualquier envergadura.

### Características Principales:

- **Independencia de Persistencia:** Implementación de patrones de Repositorio que permiten alternar o combinar bases de datos (MongoDB, PostgreSQL, etc.) sin tocar la lógica de negocio.
- **Arquitectura por Capas:** Separación estricta entre **Domain**, **Application**, **Infrastructure** y **Interface**.
- **Documentación de Elite con Scalar:** Integración personalizada para una API interactiva, con esquemas de respuesta estandarizados y ejemplos listos para probar.
- **Robustez en Errores:** Filtros globales de excepción que garantizan que el cliente siempre reciba una respuesta con `tracking ID`, `timestamp` y un formato predecible.
- **Clean Code Helpers:** Decoradores personalizados para simplificar la documentación y el manejo de rutas.

---

## 🏗️ Estructura de Capas

El proyecto está organizado para proteger el núcleo del negocio:

1.  **Domain:** Contiene las entidades, interfaces de repositorios y reglas de negocio. Es el corazón del sistema y no depende de nada externo.
2.  **Application:** Servicios y casos de uso que orquestan la lógica del dominio.
3.  **Infrastructure:** Implementaciones concretas (MongoUserRepository, PostgresUserRepository, adaptadores de JWT, etc.).
4.  **Interface (Presentation):** Controladores, DTOs y configuración de la API. Aquí es donde vive la magia de la documentación.

---

## 🏗️ Estructura del Proyecto

```text
src/
├── common/           # Filtros, interceptores, decoradores y excepciones globales
├── modules/
│   └── users/
│       ├── domain/         # Entidades e interfaces de repositorio (Core)
│       ├── application/    # Servicios (Casos de Uso)
│       ├── infrastructure/ # Implementaciones de bases de datos (Mongo/Postgres)
│       └── interface/      # Controladores y DTOs
├── main.ts           # Configuración central y documentación
```
