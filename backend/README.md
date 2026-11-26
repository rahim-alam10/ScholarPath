# ScholarPath backend

A dependency-free Node.js REST API for the mobile app's account endpoints.
It stores account records in `backend/data/users.json`; password hashes are
stored instead of plaintext passwords. This local JSON store is intended for
development and a single server process, not production or multi-instance use.

## Structure

- `server.js` — process entry point.
- `src/app.js` — HTTP server setup and error handling.
- `src/routes.js` — maps HTTP methods and paths to controllers.
- `src/controllers/` — validates requests and builds API responses.
- `src/services/` — authentication and session behavior.
- `src/repositories/` — persistent user data access.
- `src/http/` — JSON request and response helpers.
- `src/errors/` — HTTP errors with status codes.
- `src/config.js` — shared server settings.

## Run

Requires Node.js 18 or newer.

```sh
cd backend
npm start
```

The server listens on port `3000` by default. Set `PORT` to change it. Configure
the app's `EXPO_PUBLIC_API_URL` to the server's reachable address, such as
`http://localhost:3000` for a simulator or `http://<computer-lan-ip>:3000` for a
physical device.

## Endpoints

- `GET /health` — health check.
- `POST /users/register` — JSON `{ "name", "email", "password" }`; creates an
  account and returns `{ "token", "user" }`.
- `POST /users/login` — JSON `{ "email", "password" }`; returns `{ "token",
  "user" }`, matching the mobile API response type.
- `GET /users/me` — requires `Authorization: Bearer <token>`; returns the
  current user profile.

Tokens expire after seven days and are held in memory, so a server restart
invalidates existing sessions. Persistent storage, session persistence,
rate-limiting, and production deployment configuration should be added before
using this starter with real users.

Run the API tests with `npm test` from this folder.
