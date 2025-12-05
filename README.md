API Gateway - Unificador de datos

Este es el corazón de la arquitectura. API Gateway que centraliza y une todas las fuentes de datos.

Se encarga de:

- Usuarios y Autenticación personalizada (JWT)
- Lógica de negocio (pagos, reglas, emails, colas, etc.)
- Proxy a Servicio de Blog (fmarcosdev.api.blog) para contenido
- Exponer su propia API (/api/users, /api/orders, /articles, etc.)
- Punto central para futuras integraciones

Endpoints disponibles:

- GET http://localhost:3001/articles (desde Strapi)
- GET http://localhost:3001/ (health check)


# pendiente
. Autenticación en NestJS
Implementa JWT y protege ciertas rutas si quieres que el frontend pase un token.

. Prepararte para deploy
Puedes subir tanto el CMS como el backend a Railway u otra plataforma.

