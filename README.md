# 🐹 CuyPeru - E-Commerce Platform

Plataforma e-commerce para la venta de carne de cuy peruano. Incluye frente Next.js y API Express.js con PostgreSQL.

## Estructura

```
wp/
├── frontend/     # Next.js 16 (App Router, Tailwind CSS v4)
├── backend/      # Express.js + Prisma + PostgreSQL
├── k8s/          # Manifiestos Kubernetes (EKS: postgres, backend, frontend, Kafka)
├── .github/      # GitHub Actions CI/CD
├── docker-compose.yml  # Stack completo en Docker (postgres + backend + frontend)
└── infra.md      # Instrucciones de despliegue en producción
```

## Categorías de productos

| Categoría      | Peso    |
| -------------- | ------- |
| Comercial      | ~300g   |
| Mediano        | ~400g   |
| Grande         | ~500g   |
| Deshuesado     | ~300g   |
| Gourmet Premium| ~300g   |

## Inicio rápido

### Requisitos

- Node.js 20.9+
- Docker (para PostgreSQL local) o un PostgreSQL existente

### Base de datos

```bash
# Levantar PostgreSQL con Docker (puerto 5433, evita conflictos con el del sistema)
docker run --name cuy-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cuy_ecommerce \
  -d -p 5433:5432 postgres:16-alpine
```

### Backend (puerto 5000)

```bash
cd backend
cp .env.example .env          # ajusta si tu DB difiere
npm install
npm run db:migrate            # crea el esquema
npm run db:seed               # carga 5 productos y un admin
npm run dev                   # http://localhost:5000
```

### Frontend (puerto 3000)

```bash
cd frontend
cp .env.example .env.local  # ajusta NEXT_PUBLIC_API_URL si cambias el puerto
npm install
npm run dev                   # http://localhost:3000
```

### Usuario seed

- Email: `admin@cuyperu.com`
- Password: `Admin123!`

## Endpoints API

| Método | Ruta                          | Descripción                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/api/health`                 | Estado del servidor                |
| POST   | `/api/auth/register`          | Crear cuenta                       |
| POST   | `/api/auth/login`             | Iniciar sesión (JWT)               |
| GET    | `/api/auth/me`                | Perfil del usuario                 |
| GET    | `/api/products`               | Lista de productos (filtrable)     |
| GET    | `/api/products/:slug`         | Producto individual                |
| GET    | `/api/products/:slug/related` | Productos relacionados             |
| GET    | `/api/categories`             | Categorías                         |
| GET    | `/api/cart`                   | Carrito (usuario o sesión)         |
| POST   | `/api/cart/items`             | Agregar al carrito                 |
| PUT    | `/api/cart/items/:productId`  | Actualizar cantidad                |
| DELETE | `/api/cart/items/:productId`  | Quitar del carrito                 |
| POST   | `/api/cart/merge`             | Fusionar carrito de sesión→usuario |
| POST   | `/api/checkout`               | Crear pedido                       |
| GET    | `/api/orders`                 | Pedidos del usuario                |
| GET    | `/api/wishlist`               | Favoritos (usuario o sesión)       |
| POST   | `/api/price-alerts`           | Crear alerta de precio             |

## Despliegue

### Docker (entorno completo)

```bash
docker compose up -d --build
# frontend: http://localhost:3000 · backend: http://localhost:5000 · postgres: puerto 5433
```

### Kubernetes / Amazon EKS

Manifiestos listos en `k8s/` (namespace `cuy-peru`, Ingress con cert-manager, Postgres StatefulSet, 2 réplicas de backend/frontend, Kafka KRaft):

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/kafka.yaml
```

### CI/CD (GitHub Actions)

`.github/workflows/ci.yml` ejecuta typecheck + lint + build del backend y frontend en cada push/PR, publica las imágenes Docker en GHCR y despliega a EKS al mergear a `main`. Requiere secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (cluster EKS llamado `cuy-peru`).

### SEO

`sitemap.xml` y `robots.txt` se generan automáticamente (Next.js Metadata Routes). Las páginas de producto incluyen JSON-LD (`Product` schema) para resultados enriquecidos. Configura `NEXT_PUBLIC_SITE_URL` en producción para URLs canónicas correctas.

## Scripts backend

| Comando                 | Descripción                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Servidor con recarga en caliente     |
| `npm run build`         | Compilar a `dist/`                   |
| `npm run typecheck`     | Verificación de tipos TypeScript     |
| `npm run db:migrate`    | Crear/aplicar migraciones Prisma     |
| `npm run db:seed`       | Cargar datos de ejemplo              |
| `npm run db:studio`     | Abrir Prisma Studio (gestor visual)  |

## Roadmap

- [x] Fase 1: Fundación (setup, DB, esquema, componentes base)
- [x] Fase 2: Autenticación y gestión de usuarios
- [x] Fase 3: Catálogo y páginas de detalle completas
- [x] Fase 4: Carrito (persistente) y checkout con pagos
- [x] Fase 5: Favoritos, búsqueda, comparación, alertas de precio
- [x] Fase 6: SEO/Sitemap, Docker, AWS EKS + Kafka + CI/CD (WhatsApp ya integrado)