# Form Builder Application

A full-stack form builder with admin panel, dynamic form rendering, and submission management.

## Features

- **Admin Panel**: Create, edit, and delete forms with dynamic fields
- **Field Types**: Text, textarea, number, email, date, checkbox, radio, select, file
- **Validation**: Client-side (Formik/Yup) and server-side (Zod) validation
- **Form Renderer**: Public form viewing and submission
- **Submission Management**: View and filter form submissions with pagination
- **Authentication**: JWT-based admin authentication
- **Database**: MongoDB for persistence
- **Dockerized**: Complete Docker setup for local development

## Quick Start

### Using Docker Compose

```bash
docker-compose up
```

- Backend: http://localhost:5000
- client: http://localhost:4173
- MongoDB: mongodb://admin:password@localhost:27017

### Default Admin Credentials

Sign up to create an admin account on first login.

### Local Development

1. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

2. **client Setup**
```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Forms (Admin)
- `POST /api/forms` - Create form
- `GET /api/forms` - List all forms
- `GET /api/forms/:id` - Get form details
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Submissions
- `POST /api/submissions` - Submit form response
- `GET /api/submissions/form/:formId` - Get submissions (admin)
- `DELETE /api/submissions/:id` - Delete submission (admin)

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Server entry
│   ├── Dockerfile
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── package.json
└── docker-compose.yml
```



## Login Dashboard
 ![login](./public/Screenshot1.png)


## Admin Dashboard
 ![admn](./public/Screenshot2.png)
 ![admin](./public/Screenshot8.png)
 


## Dynamic Form builder
 ![form](./public/Screenshot3.png)  
 ![form](./public/Screenshot4.png)  


## Form Preview
 ![preview](./public/Screenshot5.png)
 ![preview](./public/Screenshot6.png)

## Form Submission
 ![submission](./public/Screenshot7.png)

