# TinyLink

TinyLink is a URL shortening web application similar to Bit.ly. It allows users to create short URLs, view statistics, and manage links. The app is built using **Next.js** and **Express.js**, with **PostgreSQL (Neon)** as the database.

---

## Features

- **Create Short Links**
  - Shorten long URLs into concise links.
  - Optional custom short code (globally unique).
  - Validates URLs before saving.
  - Duplicate codes return a `409 Conflict` error.

- **Redirect**
  - Visiting `/shortcode` redirects to the original URL.
  - Redirect increments click count and updates the “last clicked” timestamp.

- **Delete Links**
  - Users can delete existing links.
  - Deleted links return `404` on access.

- **Dashboard**
  - Lists all links with:
    - Short code
    - Target URL
    - Total clicks
    - Last clicked time
  - Supports adding and deleting links.
  - Search/filter by code or URL.

- **Stats Page**
  - `/code/:code` displays details for a single link.

- **Healthcheck**
  - `/healthz` returns system status, uptime information and other informations.

---

## Interface & UX

- Clean, responsive design using **Custom CSS**.
- Friendly inline validation and error messages.
- Tables support sorting, filtering, and copy buttons.
- Consistent buttons, spacing, and typography.
- Loading, success, and error states are visually clear.

---

## Pages & Routes

| Page | Path | Auth |
|------|------|------|
| Dashboard | `/` | Public |
| Stats | `/code/:code` | Public |
| Redirect | `/:code` | Public |
| Health Check | `/healthz` | Public |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/links` | Create a new link (returns 409 if code exists) |
| GET | `/api/links` | List all links |
| GET | `/api/links/:code` | Get stats for a specific link |
| DELETE | `/api/links/:code` | Delete a link |

---

## Features & Behavior

- **Short Code Rules:** Codes must match `[A-Za-z0-9]{6,8}` and be globally unique.
- **Redirect:** Accessing a valid short code increments the click count and updates the last clicked time.
- **Deletion:** Deleted codes return `404` and no longer redirect.
- **Dashboard:** Supports adding links with optional custom codes, deleting links, searching, and filtering.
- **Stats Page:** Shows detailed information for a single link.
- **Healthcheck:** Returns JSON status, including uptime and system info.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tinylink.git
cd tinylink
```

2. Config Client

```bash
cd app
npm install
```

Add environment variables

Start Client
```bash
npm start
```

3. Config Server

```bash
cd server
npm install
```

Add environment variables

Start Server
```bash
npm start
```



