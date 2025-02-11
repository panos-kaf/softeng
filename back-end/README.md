# Backend - Toll Station Interoperability WebApp

## Overview
The backend is a Node.js application using Express.js to handle API requests related to toll station interoperability. It provides authentication, toll pass management, cost calculations, and administrative functionalities.

## Project Structure
```
backend/
│── server.js        # Initializes HTTP & HTTPS servers, handles redirections
│── app.js           # Express app setup, middleware, routing
│── cron/            # Scheduled background jobs
│── middleware/      # Authentication & authorization middleware
│── api/             # Main API routes
│   ├── index.js     # Main API router, mounts feature-specific routes
│   ├── admin/       # Admin-specific API routes
│   ├── tollStationPasses.js  # Handles toll station passes
│   ├── passAnalysis.js       # Pass analysis endpoints
│   ├── passesCost.js         # Cost calculations
│   ├── chargesBy.js          # Charges-related queries
│   ├── payments.js           # Payment processing
│   ├── tollStations.js       # Toll station data endpoints
└── .env              # Environment variables configuration
```

## Key Features
- **Authentication:** Uses JWT authentication middleware for secure access.
- **HTTPS Support:** Runs on HTTPS with automatic HTTP to HTTPS redirection.
- **CORS Configured:** Allows cross-origin requests from the frontend.
- **Admin API:** Provides endpoints for system health checks, user management, and data resets.
- **Toll Pass Management:** Endpoints for toll pass tracking, cost calculations, and payments.
- **Error Handling:** Global error handling and 404 response for invalid routes.

## Dependencies
The backend relies on the following dependencies:
- `bcrypt`, `bcryptjs`: Used for password hashing.
- `cors`: Enables Cross-Origin Resource Sharing.
- `csv-parser`: Parses CSV files for data import.
- `dotenv`: Loads environment variables from `.env`.
- `express`: Web framework for handling HTTP requests.
- `jsonwebtoken`: Implements JWT authentication.
- `mysql2`: Connects to and queries the MySQL database.
- `node-cron`: Schedules background tasks.
- `nodemon` (devDependency): Auto-restarts the server during development.

## Running the Backend
1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up environment variables in a `.env` file:
   ```sh
   HTTP_PORT=9114
   HTTPS_PORT=9115
   HOST_IP=your-server-ip
   SSL_KEY=path/to/ssl-key
   SSL_CERT=path/to/ssl-cert
   FRONTEND_PORT=your-frontend-port
   ```
3. Start the server:
   ```sh
   npm start
   ```

The backend will run on `https://your-server-ip:9115`, with automatic redirection from HTTP.

