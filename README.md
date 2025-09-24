# 📌 Newsfeed App

Aplikasi **Newsfeed** sederhana:

* **Backend:** Go (Fiber + GORM)
* **Frontend:** Next.js + TailwindCSS
* **Database:** PostgreSQL
* **Auth:** JWT (Access + Refresh token)
* **Containerized:** Docker Compose

---

## 🗂️ Struktur Repo

```
.
├─ backend-golang/
│  ├─ cmd/main.go
│  ├─ config/...
│  ├─ database/...
│  ├─ handlers/...
│  ├─ middlewares/...
│  ├─ models/...
│  ├─ routes/...
│  ├─ .env.example
│  ├─ Dockerfile
│  └─ go.mod / go.sum / vendor/
├─ frontend-nextjs/
│  ├─ src/app/...
│  ├─ public/...
│  ├─ .env.example
│  └─ Dockerfile
├─ db/
│  └─ init.sql
└─ docker-compose.yml
```

> **Catatan Git (penting):**
> Jangan jadikan `frontend-nextjs` sebagai repo Git ter-embed. Jika terlanjur ada `.git` di dalam `frontend-nextjs`, hapus:
> `rm -rf frontend-nextjs/.git && git add -A && git commit -m "Fix nested git repo"`

---

## ⚙️ Environment

### `backend-golang/.env.example`

```ini
# DB
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=newsfeed

# App
PORT=8080
JWT_SECRET=super_rahasia_banget_123
# Comma separated origins (contoh: http://localhost:3000,http://127.0.0.1:3000)
CORS_ORIGINS=http://localhost:3000
```

### `frontend-nextjs/.env.example`

```ini
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 🚀 Setup Instructions

### 1) Clone & siapkan dependency Go (agar build lebih stabil di Docker)

```bash
git clone <url-repo>
cd Take-Home-Test

cd backend-golang
go mod tidy
go mod vendor    # penting untuk build di lingkungan jaringan ketat/offline
cd ..
```

### 2) Jalankan dengan Docker Compose

```bash
docker compose up --build
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:8080/api](http://localhost:8080/api)
* Postgres: localhost:5432 (user: `postgres`, pass: `123`, db: `newsfeed`)

> Compose akan:
>
> * Menjalankan Postgres dan **menginisialisasi skema** dari `db/init.sql`
> * Menjalankan backend Go (membaca `.env` dari `backend-golang/.env`)
> * Menjalankan frontend Next.js (membaca `.env.local` dari `frontend-nextjs/.env.local`)

### 3) Jalankan tanpa Docker (opsional, untuk dev)

* **Database:** jalankan PostgreSQL lokal, buat DB `newsfeed`, impor `db/init.sql` jika perlu.
* **Backend:**

  ```bash
  cd backend-golang
  cp .env.example .env
  go run ./cmd/main.go
  ```
* **Frontend:**

  ```bash
  cd frontend-nextjs
  cp .env.example .env.local
  npm install
  npm run dev
  # Buka http://localhost:3000
  ```

---

## 🧪 Manual Test Cases (singkat)

> Bisa dipakai cepat via `curl` / HTTPie.

1. **Register**

```bash
http POST :8080/api/register Username=tester Password=secret123
```

2. **Login**

```bash
http -f POST :8080/api/login Username=tester Password=secret123
# Simpan access_token & refresh_token dari response
```

3. **Create Post**

```bash
http -f POST :8080/api/posts content='Halo dunia' "Authorization:Bearer <access_token>"
```

4. **Get Feed (default DESC)**

```bash
http GET ":8080/api/feed?page=1&limit=10&order=desc" "Authorization:Bearer <access_token>"
```

5. **Suggested Users**

```bash
http GET :8080/api/users/suggested "Authorization:Bearer <access_token>"
```

6. **Follow / Unfollow**

```bash
http POST :8080/api/follow/2 "Authorization:Bearer <access_token>"
http DELETE :8080/api/follow/2 "Authorization:Bearer <access_token>"
```

7. **Refresh Token**

```bash
http -f POST :8080/api/refresh refresh_token=<refresh_token>
```

---

## 📖 API Documentation

**Base URL:** `http://localhost:8080/api`

> **Auth:** Tambahkan header `Authorization: Bearer <access_token>` untuk endpoint yang membutuhkan login.

### Auth

#### `POST /register`

* **Body (x-www-form-urlencoded):**

  * `Username` (min 5 char)
  * `Password` (min 5 char)
* **200/201 Response:**

  ```json
  { "id": 1, "username": "tester" }
  ```

#### `POST /login`

* **Body (x-www-form-urlencoded):**

  * `Username`
  * `Password`
* **200 Response:**

  ```json
  {
    "access_token": "<jwt_access>",
    "refresh_token": "<jwt_refresh>"
  }
  ```

#### `POST /refresh`

* **Body (x-www-form-urlencoded):**

  * `refresh_token`
* **200 Response:**

  ```json
  { "access_token": "<jwt_access_baru>" }
  ```

### Posts & Feed

#### `POST /posts` *(auth)*

* **Body (x-www-form-urlencoded):**

  * `content` (maks 200 char)
* **201 Response:**

  ```json
  {
    "id": 10,
    "user_id": 1,
    "username": "tester",
    "content": "Halo dunia",
    "created_at": "2025-09-23T16:19:15.978134Z"
  }
  ```

#### `GET /feed` *(auth)*

* **Query:**

  * `page` (default 1)
  * `limit` (default 10)
  * `order` (`asc` | `desc`, default `asc`)
* **Catatan:** Feed berisi **post milik sendiri** + **post user yang di-follow**.
* **200 Response:**

  ```json
  {
    "page": 1,
    "order": "DESC",
    "posts": [
      {
        "id": 11,
        "user_id": 2,
        "username": "budi",
        "content": "Postingan budi",
        "created_at": "2025-09-23T16:54:55.380767Z"
      }
    ]
  }
  ```

### Follow

#### `GET /users/suggested` *(auth)*

* **Deskripsi:** Daftar user yang **belum** di-follow oleh user saat ini.
* **200 Response:**

  ```json
  {
    "users": [
      { "id": 2, "username": "budi", "is_followed": false },
      { "id": 3, "username": "sari", "is_followed": false }
    ]
  }
  ```

#### `POST /follow/:userid` *(auth)*

* **200 Response:**

  ```json
  { "message": "you are now following user 2" }
  ```

#### `DELETE /follow/:userid` *(auth)*

* **200 Response:**

  ```json
  { "message": "you unfollowed user 2" }
  ```

---

## 🧱 Database

File **`db/init.sql`** membuat skema berikut:

* `users(id, username UNIQUE, password_hash, created_at)`
* `posts(id, user_id FK, content(200), created_at)`
* `follows(follower_id FK, followee_id FK, created_at, PK(follower_id,followee_id))`
* `user_sessions(id, user_id FK, refresh_token, expires_at, created_at)`

Termasuk index:

* `idx_posts_userid_createdat (user_id, created_at DESC)`
* `idx_follows_follower (follower_id)`
* `idx_follows_followee (followee_id)`

> Compose secara otomatis menjalankan `db/init.sql` **sekali** saat volume data baru.

---

## 🏗️ Design Notes

* **Fiber** dipilih untuk performa & kesederhanaan pembuatan REST API.
* **GORM** untuk ORM yang rapi dan mudah di-maintain.
* **JWT Access + Refresh**: akses singkat + perpanjangan sesi aman (refresh disimpan di `user_sessions`).
* **Feed Query**:

  * Ambil post dari `p.user_id = current_user` **atau** `p.user_id IN (select followee_id ...)`.
  * Join ke `users` saat perlu menampilkan `username` (atau simpan `username` di response via SELECT).
* **CORS** dikontrol via env `CORS_ORIGINS` (default: `http://localhost:3000`).

---

## 🧩 Troubleshooting

* **CORS error / Network Error:**

  * Pastikan backend listen di `:8080` dan `CORS_ORIGINS` mengizinkan origin FE.
  * FE `NEXT_PUBLIC_API_URL` harus `http://localhost:8080/api` (saat akses dari browser host).

* **Backend gagal konek DB (host=localhost):**

  * Di Docker, **jangan** pakai `localhost`; pakai `DB_HOST=db` (nama service pada compose).

* **DB init gagal karena schema already exists:**

  * Hapus volume: `docker compose down -v` lalu `docker compose up --build`.

* **Gagal pull image / go mod download di Docker:**

  * Sudah di-`vendor` dependency Go. Pastikan Dockerfile backend menggunakan `-mod=vendor`.

* **Frontend tidak ikut ter-push ke Git (nested repo):**

  * Hapus `.git` dalam `frontend-nextjs` (lihat catatan Git di atas).

---

## 🧭 Perintah Umum

```bash
# Build & run
docker compose up --build

# Stop + hapus container
docker compose down

# Stop + hapus container + volume (reset DB)
docker compose down -v
```


