
# Users API

API untuk mengelola data **users** (CRUD).
Backend menggunakan **Node.js**, **Express.js**, **MySQL**, dan **bcrypt** untuk password hashing.

**Base URL:**

```
http://localhost:3000/users
```

**Role User:**

* `organizer`
* `customer`

**Password dikirim dalam bentuk biasa (plain text)**, akan otomatis di-hash oleh backend.



## Endpoint

| Method | Endpoint   | Deskripsi                     | Auth/Role |
| ------ | ---------- | ----------------------------- | --------- |
| GET    | /users     | Mengambil semua user          | Tidak     |
| GET    | /users/:id | Mengambil user berdasarkan ID | Tidak     |
| POST   | /users     | Membuat user baru             | Tidak     |
| PUT    | /users/:id | Mengubah data user            | Tidak     |
| DELETE | /users/:id | Menghapus user                | Tidak     |



### 1. POST /users (Create User)

**Deskripsi:**
Membuat user baru. Password dikirim plain text, akan otomatis di-hash.

**Request Body (JSON)**

```json
{
  "name": "Andi",
  "email": "andi@mail.com",
  "password": "123456",
  "role": "organizer"
}
```

**Response Success (201)**

```json
{
  "message": "User berhasil dibuat"
}
```

**Response Error – Field Wajib Kosong (400)**

```json
{
  "message": "Semua field wajib diisi"
}
```

**Response Error – Email Sudah Terdaftar (400)**

```json
{
  "message": "Email sudah terdaftar"
}
```

**Response Error Server (500)**

```json
{
  "message": "Gagal membuat user",
  "error": "Error message"
}
```


Endpoint lain (GET, PUT, DELETE) bisa dipanggil sesuai tabel di atas.

* GET /users → ambil semua user
* GET /users/:id → ambil user tertentu
* PUT /users/:id → update user
* DELETE /users/:id → hapus user

Contoh JSON **tidak disertakan**, tapi response format sama seperti POST:

```json
{
  "message": "User berhasil diupdate/hapus"
}
```

# Auth API

API untuk **login user** dan mendapatkan **JWT token**.
Backend menggunakan **Node.js**, **Express.js**, **MySQL**, **bcrypt**, dan **jsonwebtoken**.

**Base URL:**

```
http://localhost:3000/login
```

## Endpoint

| Method | Endpoint | Deskripsi                   | Auth/Role |
| ------ | -------- | --------------------------- | --------- |
| POST   | /login   | Login user dan dapatkan JWT | Tidak     |


### 1. POST /login

**Deskripsi:**
Login user menggunakan `email` dan `password`.
Jika berhasil, akan mengembalikan **JWT token** yang bisa digunakan untuk mengakses endpoint yang membutuhkan authentication.

**Request Body (JSON)**

```json
{
  "email": "andi@mail.com",
  "password": "123456"
}
```

**Response Success (200)**

```json
{
  "message": "Login berhasil",
  "token": "<JWT_TOKEN>"
}
```

**Response Error – Field Kosong (400)**

```json
{
  "message": "Email dan password wajib diisi"
}
```

**Response Error – Email/Password Salah (401)**

```json
{
  "message": "Email atau password salah"
}
```

**Response Error Server (500)**

```json
{
  "message": "Login gagal",
  "error": "Error message"
}
```


# Events API

API untuk mengelola **events** (CRUD).

* GET → bisa diakses semua user (public).
* POST, PUT, DELETE → hanya **user dengan role `organizer`** dan **login**.

**Base URL:**

```
http://localhost:3000/events
```

## Endpoint

| Method | Endpoint    | Deskripsi                      | Auth/Role        |
| ------ | ----------- | ------------------------------ | ---------------- |
| GET    | /events     | Mengambil semua event          | Tidak            |
| GET    | /events/:id | Mengambil event berdasarkan ID | Tidak            |
| POST   | /events     | Membuat event baru             | Auth + Organizer |
| PUT    | /events/:id | Mengubah event                 | Auth + Organizer |
| DELETE | /events/:id | Menghapus event                | Auth + Organizer |

> **Note:** Untuk POST, PUT, DELETE, harus menyertakan **header Authorization** dengan **JWT token** yang didapat dari login.

---

### 1. POST /events (Create Event)

**Deskripsi:**
Membuat event baru. Field `available_tickets` otomatis sama dengan `capacity`. Hanya **organizer** yang bisa membuat event.

**Headers**

```
Authorization: Bearer <token>
```

**Request Body (JSON)**

```json
{
  "id_user": 1,
  "title": "Concert",
  "description": "Live music event",
  "date": "2025-12-30",
  "location": "Jakarta",
  "capacity": 500,
  "price": 150000
}
```

**Response Success (201)**

```json
{
  "message": "Event berhasil dibuat"
}
```

**Response Error – Field Wajib Belum Lengkap (400)**

```json
{
  "message": "Field wajib belum lengkap"
}
```

**Response Error – Unauthorized (401)**

```json
{
  "message": "hanya organizer yang bisa membuat event!"
}
```

**Response Error Server (500)**

```json
{
  "message": "Gagal membuat event",
  "error": "Error message"
}
```

Endpoint lain (GET, PUT, DELETE) bisa dipanggil sesuai tabel di atas.

* GET → tanpa auth, response berisi data event.
* PUT/DELETE → harus login sebagai **organizer**, response format sama seperti POST:

```json
{
  "message": "Event berhasil diupdate/hapus"
}
```

# Booking API

API untuk mengelola **bookings** (pemesanan tiket event).

* GET → bisa diakses semua user (public).
* POST, PUT (cancel) → hanya **customer** yang login/authenticated.

**Base URL:**

```
http://localhost:3000/bookings
```


## Endpoint

| Method | Endpoint             | Deskripsi                          | Auth/Role       |
| ------ | -------------------- | ---------------------------------- | --------------- |
| GET    | /bookings            | Mengambil semua booking            | Tidak           |
| POST   | /bookings            | Membuat booking baru               | Auth + Customer |
| PUT    | /bookings/:id/cancel | Membatalkan booking berdasarkan ID | Auth + Customer |

> **Note:** Untuk POST dan PUT cancel, harus menyertakan **header Authorization** dengan **JWT token** yang didapat dari login.


### 1. POST /bookings (Create Booking)

**Deskripsi:**
Membuat booking baru untuk event tertentu.

* Memastikan **jumlah tiket tersedia cukup** (`available_tickets`).
* Menghitung `total_price = price * quantity`.
* Mengurangi `available_tickets` di tabel event secara otomatis.
* Hanya **customer** yang bisa melakukan booking.

**Headers**

```
Authorization: Bearer <token>
```

**Request Body (JSON)**

```json
{
  "id_user": 2,
  "id_event": 1,
  "quantity": 3
}
```

**Response Success (201)**

```json
{
  "message": "Booking berhasil"
}
```

**Response Error – Event Tidak Ditemukan (404)**

```json
{
  "message": "Event tidak ditemukan"
}
```

**Response Error – Tiket Tidak Cukup (400)**

```json
{
  "message": "Tiket tidak mencukupi"
}
```

**Response Error – Unauthorized (401)**

```json
{
  "message": "hanya customer yang bisa memesan tiket!"
}
```

**Response Error Server (500)**

```json
{
  "message": "Booking Gagal",
  "error": "Error message"
}
```
### 2. GET /bookings

**Deskripsi:**
Mengambil semua booking. Bisa diakses publik.

**Response Success (200)**

```json
[
  {
    "id_booking": 1,
    "id_user": 2,
    "id_event": 1,
    "quantity": 3,
    "price": 50000,
    "total_price": 150000,
    "status": "confirmed"
  }
]
```

### 3. PUT /bookings/:id/cancel (Cancel Booking)

**Deskripsi:**
Membatalkan booking.

* Menambahkan kembali `available_tickets` di tabel event.
* Status booking diubah menjadi `"cancelled"`.
* Hanya **customer** yang login bisa membatalkan.

**Headers**

```
Authorization: Bearer <token>
```

**Response Success (200)**

```json
{
  "message": "Booking dibatalkan"
}
```

**Response Error – Booking Tidak Ditemukan (404)**

```json
{
  "message": "Booking tidak ditemukan"
}
```

**Response Error – Booking Sudah Dibatalkan (400)**

```json
{
  "message": "Booking sudah dibatalkan"
}
```

**Response Error – Unauthorized (401)**

```json
{
  "message": "hanya customer yang bisa memesan tiket!"
}
```

**Response Error Server (500)**

```json
{
  "message": "Gagal cancel booking",
  "error": "Error message"
}



