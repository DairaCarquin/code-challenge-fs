# Proyecto Daira Carquin

Este proyecto contiene dos aplicaciones: una API Backend desarrollada con **NestJS** y una aplicación Frontend desarrollada con **React + Vite**. Ambas están organizadas dentro de la carpeta `Daira_Carquin`.

## Estructura del Proyecto

```
Daira_Carquin/
├── backend/
├── frontend/
└── README.md
```

## 🚀 Requisitos Previos Backend
- Docker Compose
- Node.js (v20.19.1)
- npm (v10)

## 📦 Instalación

### 1. Clonar el repositorio

Si aún no tienes el proyecto, clónalo desde el repositorio git:

```bash
git clone https://github.com/DairaCarquin/code-challenge-fs.git
cd Daira_Carquin
```

### 2. Ingresar a las carpetas del Frontend y Backend

#### Backend
Primero, accede a la carpeta del backend:

```bash
cd backend
npm install

```

#### Frontend
Luego, accede a la carpeta del frontend:

```bash
cd frontend
npm install
```

### 3. Ejecutar el Backend
Puedes ejecutar utilizando Docker Compose, para construir la imagen de Docker y ejecutar el contenedor:
```bash
docker-compose up --build
```

Puedes ejecutar tambien con:
```bash
npm run start
```
El backend estará disponible en `http://localhost:3000`.

### 4. Ejecutar el Frontend

Después de que el backend esté corriendo, puedes iniciar el frontend con:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:4000` (o el puerto configurado).

### 5. Ejecutar Pruebas en el Backend

Si necesitas ejecutar pruebas para asegurarte de que todo está funcionando correctamente en el backend, puedes ejecutar:

```bash
npm run test
```

### 6. Ejecutar pruebas E2E (End-to-End)

```bash
npm run test:e2e
```

Esto ejecutará todas las pruebas configuradas en el proyecto de backend.

## Licencia

Este proyecto está licenciado bajo la MIT License - mira el archivo [LICENSE](LICENSE) para más detalles.