# Infraestructura de producción

## Stack objetivo

| Componente  | Servicio                    | Detalle                                   |
| ----------- | --------------------------- | ----------------------------------------- |
| Frontend    | Next.js 16 en EKS           | 2 réplicas, Ingress + cert-manager (TLS)  |
| Backend     | Express 5 en EKS            | 2 réplicas, healthcheck `/api/health`     |
| Base de datos| PostgreSQL 16              | StatefulSet EKS + PVC 10Gi, migraciones en initContainer |
| Eventos     | Kafka (KRaft)               | 1 broker, topic `cuy.events` (pedidos)    |
| CI/CD       | GitHub Actions              | typecheck/lint/build → GHCR → `kubectl apply` |

## Variables de entorno

### Backend
| Variable | Ejemplo | Necesaria |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://postgres:***@postgres:5432/cuy_ecommerce` | sí |
| `JWT_SECRET` | cadena aleatoria larga | sí |
| `PORT` | `5000` | no (default) |
| `CORS_ORIGIN` | `https://www.cuyperu.pe` | sí (producción) |
| `KAFKA_BROKERS` | `kafka:9092` | no (si vacío, eventos desactivados) |
| `STRIPE_SECRET_KEY` | `sk_...` | no (futuro) |

### Frontend
| Variable | Ejemplo | Necesaria |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.cuyperu.pe` | sí |
| `NEXT_PUBLIC_SITE_URL` | `https://www.cuyperu.pe` | sí (SEO/canonical) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `51999888777` | sí |

## Kafka (eventos)

El backend publica eventos (`order.created`) en el topic `cuy.events` vía `kafkajs`.
Si `KAFKA_BROKERS` está vacío, la publicación se omite sin errores (modo local).
Eventos a consumir en el futuro: notificaciones de pedido, actualización de stock,
alertas de precio y analytics.

## Despliegue EKS

```bash
# 1. Cluster (una sola vez)
eksctl create cluster --name cuy-peru --region us-east-1 --nodegroup-name standard --node-type t3.medium --nodes 2

# 2. Manifiestos
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/kafka.yaml

# 3. Secrets de producción (sobrescribir los de ejemplo)
kubectl -n cuy-peru create secret generic backend-secret --from-literal=DATABASE_URL='...' --from-literal=JWT_SECRET='...'

# 4. Ingress + TLS
kubectl apply -f k8s/frontend.yaml   # incluye Ingress con cert-manager letsencrypt
```

## Notas

- El `Secret` de ejemplo usa valores `change-me-*` — reemplázalos en producción.
- El backend aplica migraciones en un initContainer antes de arrancar (patrón migraciones).
- Las imágenes se referencian como `ghcr.io/<repo>/backend|frontend:latest` (asegura
  imagePullSecrets si el repo GHCR es privado).