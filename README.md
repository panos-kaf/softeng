# Toll Station Interoperability Web Application

## Overview

This project is a **Node.js-based web application** designed to facilitate interoperability between toll stations operated by different entities. The system allows users to manage toll transactions, analyze pass data, handle payments, and calculate settlements between operators.

## Features

- **Secure Authentication:** Supports user authentication using JSON Web Tokens (JWT).
- **Role-Based Access Control:** Admins and users have different permissions.
- **REST API:** Provides endpoints for handling toll station transactions, settlements, and operator management.
- **Automated Cron Jobs:** Handles scheduled tasks like settlements and database maintenance.
- **CLI Client:** A command-line interface for interacting with the system programmatically.
- **Frontend Dashboard:** A **React-based web app** with role-specific views for admins and users.
- **MySQL Database:** Stores user credentials, toll station details, transactions, and settlements.
- **Secure Communication:** HTTPS with self-signed certificates.

---

## Project Structure

### Backend

- **server.js** - Sets up an HTTPS/HTTP server with redirection.
- **app.js** - Initializes Express.js, middleware, and API routes.
- **api/** - API routes for authentication, transactions, payments, settlements, and toll stations.
- **middleware/** - Authentication and authorization middleware.
- **utils/** - Helper functions (user creation, date conversion, settlements, logging).
- **cron/** - Scheduled jobs for system maintenance and settlements.

### Frontend

- **React Application** powered by Vite.
- **App.jsx** - Defines routes and role-based protected pages.
- **components/** - Shared UI components like Sidebar.
- **pages/** - Main pages (Home, Passes, Payments, Settings, Login).

### CLI Client

- **cli.js** - Command-line interface for interacting with the backend.
- **commands/** - Various CLI commands (login, logout, admin tasks, data retrieval).
- **utils/** - Utility functions for API requests and database interactions.

### Database Schema

- **users** - Stores user information and roles.
- **operators** - Stores toll station operators.
- **toll\_stations** - Details of toll stations (location, pricing, operator ID).
- **tags** - Stores RFID tag details for vehicles.
- **transactions** - Records toll transactions.
- **settlements** - Handles operator-to-operator payments.

---

## Installation & Setup

### Prerequisites

- Node.js & npm
- MySQL

### Clone the Repository

```sh
git clone https://github.com/your-repo/toll-system.git
cd toll-system
```

### Backend Setup

1. Install dependencies:
   ```sh
   cd back-end
   npm install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and update values:
   ```
   HTTP_PORT=9114
   HTTPS_PORT=9115
   FRONTEND_PORT=9000
   HOST=localhost
   LAN_HOSTNAME=Panos-MacBook-Pro.local
   JWT_SECRET=42
   DB=softeng
   DB_USER=root
   DB_PASS=root
   DB_PORT=3306
   DB_HOST=127.0.0.1
   SSL_CERT=./cert/selfsigned.crt
   SSL_KEY=./cert/selfsigned.key
   ```
3. Start the backend server:
   ```sh
   npm start
   ```

### Database Setup

1. Create the database:
   ```sh
   mysql -u root -p -e "CREATE DATABASE softeng;"
   ```
2. Import tables:
   ```sh
   mysql -u root -p softeng < database/schema.sql
   ```

### Frontend Setup

1. Install dependencies:
   ```sh
   cd front-end
   npm install
   ```
2. Configure environment variables:
   ```
   VITE_PORT=9000
   VITE_HOST=localhost
   VITE_API_URL=https://localhost:9115
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

### CLI Client Setup

1. Install dependencies:
   ```sh
   cd cli-client
   npm install
   ```
2. Run CLI commands:
   ```sh
   node cli.js --help
   ```

---

## Dependencies

### Backend

```json
{
  "axios": "^1.7.9",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mysql2": "^3.12.0",
  "node-cron": "^3.0.3",
  "nodemon": "^3.1.9"
}
```

### Frontend

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.5",
  "axios": "^1.7.9",
  "vite": "^6.0.11",
}
```

### CLI Client

```json
{
  "axios": "^1.7.9",
  "commander": "^13.1.0",
  "dotenv": "^16.4.7",
  "jsonwebtoken": "^9.0.2",
  "mysql2": "^3.12.0",
  "mocha": "^11.1.0"
}
```

---

## API Endpoints

- **Authentication**
  - `POST /login` - User login
  - `POST /logout` - User logout
- **Toll Transactions**
  - `GET /api/tollStationPasses` - List toll transactions
  - `POST /api/makePayment` - Process a payment
- **Admin Actions**
  - `POST /api/admin/resetstations` - Reset stations
  - `POST /api/admin/createuser` - Create a new user

---

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License

