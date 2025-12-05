# API Gateway

Centralized API Gateway for multiple microservices built with NestJS.

## Setup

```bash
npm install
cp .env.example .env  # Configure variables
npm run dev
```

## Environment Variables

- `PORT` - Gateway port (default: 3001)
- `CORS_ORIGIN` - Frontend URL
- `CMS_URL` - Strapi CMS URL

## Endpoints

**Swagger Docs**: http://localhost:3001/

- `GET /api/health` - Health check
- `GET /api/articles` - Blog articles (from Strapi)

## Architecture

```
Frontend → API Gateway → Microservices
                ├── fmarcosdev.api.blog (Strapi)
                └── [Future services]
```

## TODO

- [ ] JWT Authentication
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Deploy config
