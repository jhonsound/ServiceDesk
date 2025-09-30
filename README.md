# ServiceDesk

Este es un proyecto de Service Desk que permite a los usuarios crear tickets, gestionarlos y hacerles seguimiento. Cuenta con un backend desarrollado en NestJS y un frontend en Next.js.

## Prerrequisitos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- [Node.js](https://nodejs.org/) (versión 20 o superior)
- [pnpm](https://pnpm.io/installation)
- [MySQL](https://dev.mysql.com/downloads/installer/) u otro cliente de base de datos compatible.

## Configuración del Entorno

### 1. Base de Datos

El backend utiliza TypeORM para la gestión de la base de datos. La configuración se encuentra en `backend/src/app.module.ts`. Por defecto, está configurado para una base de datos MySQL.

Deberás crear una base de datos y configurar las credenciales en el archivo `app.module.ts` o, preferiblemente, utilizando variables de entorno.

### 2. Variables de Entorno

Es recomendable utilizar un archivo `.env` en el directorio `backend` para gestionar las credenciales de la base de datos y otras configuraciones sensibles.

**Backend (`backend/.env`):**

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=servicedesk
JWT_SECRET=tu_secreto_jwt
```

**Frontend (`frontend/.env.local`):**

El frontend necesita saber la URL del backend.

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Instalación y Ejecución

Sigue estos pasos para levantar el proyecto completo.

### 1. Backend

Primero, instala las dependencias y ejecuta el servidor de desarrollo del backend.

```bash
# Navega al directorio del backend
cd backend

# Instala las dependencias
pnpm install

# (Opcional) Ejecuta el seeder para poblar la base de datos con datos iniciales
# Asegúrate de que la base de datos esté creada y las credenciales sean correctas
pnpm run seed

# Inicia el servidor de desarrollo
pnpm run start:dev
```

El backend estará corriendo en `http://localhost:3000`.

### 2. Frontend

En una nueva terminal, instala las dependencias y ejecuta el servidor de desarrollo del frontend.

```bash
# Navega al directorio del frontend
cd frontend

# Instala las dependencias
pnpm install

# Inicia el servidor de desarrollo
pnpm run dev
```

El frontend estará disponible en `http://localhost:3001`.

## Scripts Útiles

### Backend

- `pnpm run build`: Compila la aplicación para producción.
- `pnpm run format`: Formatea el código con Prettier.
- `pnpm run lint`: Revisa el código con ESLint.
- `pnpm test`: Ejecuta las pruebas unitarias.

### Frontend

- `pnpm run build`: Compila la aplicación para producción.
- `pnpm run start`: Inicia el servidor de producción.
- `pnpm run lint`: Revisa el código con ESLint.
