# Config Service API

API REST para gestión centralizada de configuraciones dinámicas en arquitecturas de microservicios.

## 📋 Descripción

Este servicio permite a las aplicaciones consumir variables de configuración (feature flags, URLs de terceros, credenciales) de forma dinámica, sin necesidad de reiniciarse. Desacopla la configuración del código, mejorando la escalabilidad, seguridad y el ciclo de despliegue.

## 🛠️ Tecnologías

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **PostgreSQL** - Base de datos relacional
- **TypeORM** - ORM para TypeScript
- **Docker & Docker Compose** - Contenerización y orquestación
- **JWT** - Autenticación con tokens
- **Swagger/OpenAPI** - Documentación de API

## 🚀 Requisitos Previos

- **Node.js** (v18 o superior)
- **Docker Desktop** instalado y corriendo
- **npm** o **yarn**

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd config_service_api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

El archivo `.env` debe contener:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=config_service

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Auth Configuration
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
```

## 🐳 Despliegue con Docker

### Opción 1: Ejecutar con Docker Compose (Recomendado)

```bash
# Construir y levantar los contenedores
docker-compose up --build

# Para ejecutar en segundo plano (detached mode)
docker-compose up -d --build
```

Esto levantará:
- **config-api**: API REST en el puerto 3000
- **database**: PostgreSQL en el puerto 5432

### Opción 2: Desarrollo local (sin Docker)

Si prefieres ejecutar solo la aplicación sin Docker:

1. Asegúrate de tener PostgreSQL instalado y corriendo
2. Configura el `.env` con `DB_HOST=localhost`
3. Ejecuta:

```bash
npm run start:dev
```

## 📚 Endpoints

### Health Check

- `GET /status` - Responde "pong" (no requiere autenticación)

### Autenticación

- `POST /auth/login` - Obtener token JWT

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Entornos (Environments)

**Todos los endpoints requieren autenticación con Bearer Token**

- `GET /environments` - Listar entornos (con paginación)
- `POST /environments` - Crear entorno
- `GET /environments/:env_name` - Obtener un entorno
- `PUT /environments/:env_name` - Actualizar entorno (completo)
- `PATCH /environments/:env_name` - Actualizar entorno (parcial)
- `DELETE /environments/:env_name` - Eliminar entorno
- `GET /environments/:env_name.json` - **Consumo masivo** (JSON plano)

### Variables

**Todos los endpoints requieren autenticación con Bearer Token**

- `GET /environments/:env_name/variables` - Listar variables del entorno
- `POST /environments/:env_name/variables` - Crear variable
- `GET /environments/:env_name/variables/:var_name` - Obtener variable
- `PUT /environments/:env_name/variables/:var_name` - Actualizar variable
- `PATCH /environments/:env_name/variables/:var_name` - Actualizar parcialmente
- `DELETE /environments/:env_name/variables/:var_name` - Eliminar variable

## 📖 Documentación Swagger

Una vez levantado el servicio, accede a:

- **Interfaz visual**: http://localhost:3000/api/docs
- **JSON OpenAPI**: http://localhost:3000/api/docs-json

## 🧪 Ejemplos de Uso

### 1. Autenticarse

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Crear un entorno

```bash
curl -X POST http://localhost:3000/environments \
  -H "Authorization: Bearer <tu-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "dev",
    "description": "Entorno de desarrollo"
  }'
```

### 3. Crear una variable

```bash
curl -X POST http://localhost:3000/environments/dev/variables \
  -H "Authorization: Bearer <tu-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API_URL",
    "value": "https://api-dev.example.com",
    "description": "URL de la API en desarrollo",
    "is_sensitive": false
  }'
```

### 4. Consumo masivo (JSON plano)

```bash
curl http://localhost:3000/environments/dev.json \
  -H "Authorization: Bearer <tu-token>"
```

**Response:**
```json
{
  "API_URL": "https://api-dev.example.com",
  "DB_URL": "postgres://localhost:5432/mydb",
  "FEATURE_NEW_UI": "true"
}
```

## 📦 Estructura del Proyecto

```
config_service_api/
├── src/
│   ├── auth/                   # Módulo de autenticación JWT
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── environments/           # Módulo de entornos
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── environments.controller.ts
│   │   ├── environments.service.ts
│   │   └── environments.module.ts
│   ├── variables/              # Módulo de variables
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── variables.controller.ts
│   │   ├── variables.service.ts
│   │   └── variables.module.ts
│   ├── common/                 # DTOs compartidos
│   │   └── dto/
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔒 Seguridad

- Todos los endpoints (excepto `/status` y `/auth/login`) están protegidos con **JWT**
- Las variables sensibles pueden marcarse con `is_sensitive: true`
- Cambia `JWT_SECRET` en producción por una clave segura
- Cambia las credenciales por defecto (`AUTH_USERNAME` y `AUTH_PASSWORD`)

## 🧹 Comandos Útiles

```bash
# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (datos de DB)
docker-compose down -v

# Ver logs
docker-compose logs -f

# Ver logs solo de la API
docker-compose logs -f config-api

# Reconstruir contenedores
docker-compose up --build

# Ejecutar tests
npm run test

# Ejecutar en modo desarrollo (local)
npm run start:dev

# Build de producción
npm run build

# Ejecutar producción (local)
npm run start:prod
```

## 📊 Códigos de Estado HTTP

El servicio utiliza los siguientes códigos de estado según las mejores prácticas REST:

- `200 OK` - Operación exitosa (GET, PUT, PATCH)
- `201 Created` - Recurso creado exitosamente (POST)
- `204 No Content` - Recurso eliminado exitosamente (DELETE)
- `400 Bad Request` - Payload inválido o error de sintaxis
- `401 Unauthorized` - No autenticado o token inválido
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Recurso ya existe
- `500 Internal Server Error` - Error inesperado del servidor

## 👥 Autor

William - Práctica de Sistemas Distribuidos

## 📝 Licencia

Este proyecto es para fines educativos.
