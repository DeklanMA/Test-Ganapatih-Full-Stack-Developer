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
cd Test-Ganapatih-Full-Stack-Developer'

cd backend-golang
go mod tidy
go mod vendor    
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

<img width="1382" height="305" alt="gambar" src="https://github.com/user-attachments/assets/627c87af-3244-4282-b42d-19f4c52d2e56" />

<img width="1384" height="267" alt="{72D50A56-0941-45FF-BB16-5791061FD63E}" src="https://github.com/user-attachments/assets/873bcb6c-d386-4498-bd4c-b6f24e885145" />

<img width="1360" height="289" alt="{1A7A65E9-AD17-488F-B760-20C612D77182}" src="https://github.com/user-attachments/assets/39c511fc-f260-463f-80df-5c6fdfd122ca" />




2. **Login**

<img width="1399" height="263" alt="{225EF8A3-DE9A-4B24-A27D-336CB59F703E}" src="https://github.com/user-attachments/assets/98546b3d-838a-4f14-aad9-a6fdd2903f8c" />

<img width="1406" height="251" alt="{438A06BA-E696-4DFE-9D6B-A25729F35B58}" src="https://github.com/user-attachments/assets/55befc22-d98b-497d-a3d1-e170f4cd1152" />

<img width="1401" height="351" alt="{64DF3180-1CE1-40C8-A29F-E6E6645F90C3}" src="https://github.com/user-attachments/assets/87304ecb-6488-4d2f-b62a-72c49a386e9d" />


3. **Create Post**

<img width="1409" height="302" alt="{69FF7747-D87F-4A0B-8B33-AF38B285E018}" src="https://github.com/user-attachments/assets/3defaea6-b5e0-40da-b2d1-9b9d35eaa8c3" />

<img width="1405" height="277" alt="{02CDBBF5-D325-4AEA-8960-64854BF85089}" src="https://github.com/user-attachments/assets/a609bd55-f9dc-4e54-8afb-eb32243b9b4d" />

4. **Get Feed (default dsc)**

<img width="1430" height="460" alt="{A899A502-385A-4A25-B2EB-3759CF028CBD}" src="https://github.com/user-attachments/assets/5a454069-7efc-48f9-a426-13c468a52aed" />

5. **Suggested Users**

<img width="1376" height="905" alt="{22DF9EC3-05E9-4439-B9B7-9A7C33884D2A}" src="https://github.com/user-attachments/assets/71914e6a-c89e-401b-a750-266c32a45a66" />


6. **Follow / Unfollow**

**Follow**
<img width="1406" height="334" alt="{3473D009-F0DF-4A79-9F50-D0B8AF7874EC}" src="https://github.com/user-attachments/assets/e177a963-830a-4b05-9c09-d151d7fdeb01" />

**unfollow**
<img width="1407" height="341" alt="{C989A186-F822-4317-8F42-2C0CAEA16A3F}" src="https://github.com/user-attachments/assets/671309b9-5a62-4499-a3c1-ef108a845100" />


7. **Refresh Token**

<img width="1425" height="296" alt="{AC9BE210-2C22-479E-9A49-98D17E011589}" src="https://github.com/user-attachments/assets/cef415aa-0628-4b31-8d42-95d5fa577857" />

<img width="1416" height="287" alt="{95CF77D0-541B-4872-9950-CA7B910F2202}" src="https://github.com/user-attachments/assets/977f5a43-f41b-4b15-945d-9ce664566ece" />



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
  * `order` (`asc` | `desc`, default `dsc`)
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

## Tampilan Front-end

**login**


**dashboard**
<img width="1913" height="1080" alt="{DA4AE3A9-67C8-4A68-B857-92D35747AE33}" src="https://github.com/user-attachments/assets/e94e1c7b-0be6-4045-8f9e-e2365aa3b7e5" />



