# ScholarPath backend

A Node.js REST API backed by MongoDB and Mongoose.

## Structure

- `server.js` — process entry point.
- `src/app.js` — HTTP server setup and error handling.
- `src/routes.js` — maps HTTP methods and paths to controllers.
- `src/controllers/` — validates requests and builds API responses.
- `src/services/` — authentication and session behavior.
- `src/repositories/` — MongoDB-backed data access.
- `src/models/` — Mongoose models for users, academic profiles, scholarships,
  research opportunities, saved items, and applications.
- `src/config/database.js` — MongoDB connection lifecycle.
- `src/http/` — JSON request and response helpers.
- `src/errors/` — HTTP errors with status codes.
- `src/config.js` — loads `backend/.env` and shared settings.

## Run

Requires Node.js 18 or newer.

```sh
cd backend
npm install
npm start
```

Set these values in `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/
DATABASE_NAME=ScholarPath
```

Copy `backend/.env.example` as a starting point and replace the URI placeholders
with your MongoDB connection details. Percent-encode special characters in the
username or password.

The backend also accepts the existing misspelled `MONGODG_URI` variable as a
compatibility fallback; prefer `MONGODB_URI` going forward. Keep `.env` private
and never commit database credentials. The backend loads it automatically.
`DATABASE_NAME` selects the database even if the URI contains a default
database name.

The server listens on port `3000` by default. Set `PORT` to change it. Configure
the app's `EXPO_PUBLIC_API_URL` to the server's reachable address, such as
`http://10.0.2.2:3000` for the Android emulator, `http://localhost:3000` for an
iOS simulator or web browser, or `http://<computer-lan-ip>:3000` for a physical
device on the same network. Restart Expo after changing the frontend `.env`.

Seed Pakistan-focused scholarship and research programme records for the mobile
app (safe to rerun; records are upserted by slug):

```sh
npm run seed
```

The mobile app retrieves Pakistan-based scholarship and research records from
MongoDB through `GET /scholarships`, `GET /scholarships/:slug`, `GET /research`,
and `GET /research/:slug`. The API excludes records that are not marked as
Pakistan-based.

## Endpoints

- `GET /health` — health check.
- `POST /users/register` — JSON `{ "name", "email", "password" }`; creates an
  account and optional `academicProfile` fields (`qualification`,
  `fieldOfStudy`), then returns
  `{ "token", "user" }`. User and academic profile records are created together
  in a MongoDB transaction.
- `POST /users/login` — JSON `{ "email", "password" }`; returns `{ "token",
  "user" }`, matching the mobile API response type.
- `GET /users/me` — requires `Authorization: Bearer <token>`; returns the
  current user profile.

Tokens expire after seven days and are held in memory, so a server restart
invalidates existing sessions. Password hashes and account records are stored
in MongoDB; seed scholarship and research records separately before expecting
them to appear in the app.

Run the API tests with `npm test` from this folder.
