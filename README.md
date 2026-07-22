
189190191192193194195196197198199200201202203204205206207208209210211212213214215216217218219220221222223224225226227228
- feat: penambahan fitur baru
- fix: perbaikan bug
- docs: perubahan dokumentasi
- chore: tugas maintenance seperti update dependency
- refactor: perbaikan struktur kode tanpa mengubah perilaku

SAKU SEHAT Frontend
Deskripsi
SAKU SEHAT Frontend adalah antarmuka aplikasi web untuk alur autentikasi pengguna pada platform SAKU SEHAT. Project ini menyediakan pengalaman register, verifikasi OTP, dan login dengan desain modern berbasis Next.js dan React. Fokus utama aplikasi saat ini adalah mempermudah pengguna melakukan proses masuk ke sistem sebelum melanjutkan ke alur berikutnya dalam aplikasi.

Key Features
Halaman register dengan validasi input seperti nama, username, email, password, dan konfirmasi password.
Alur verifikasi akun menggunakan kode OTP yang dikirim ke email pengguna.
Halaman login dengan autentikasi berbasis identifier dan password.
Integrasi dengan backend melalui endpoint autentikasi menggunakan fetch API.
UI responsif dengan desain dark mode dan komponen modern.
Support konfigurasi API base URL melalui environment variable.
Preview
Berikut adalah contoh endpoint yang digunakan oleh frontend untuk proses autentikasi.

1. Register
Endpoint:

POST /api/auth/register
Contoh request:

{
  "fullName": "Budi Santoso",
  "username": "budis",
  "email": "budi@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
Contoh response:

{
  "success": true,
  "message": "Pendaftaran berhasil, silakan cek email untuk kode OTP",
  "data": {
    "email": "budi@example.com"
  }
}
Validasi:

Password dan confirmPassword harus sama.
Email, username, dan password wajib diisi.
Frontend akan menampilkan pesan error jika registrasi gagal.
2. Verify OTP
Endpoint:

POST /api/auth/verify-otp
Contoh request:

{
  "email": "budi@example.com",
  "otpCode": "123456"
}
Contoh response:

{
  "success": true,
  "message": "Akun berhasil diaktifkan"
}
Validasi:

Kode OTP wajib berisi 6 digit angka.
Email dan OTP wajib diisi.
Jika OTP kadaluarsa, user bisa mengirim ulang OTP.
3. Resend OTP
Endpoint:

POST /api/auth/resend-otp
Contoh request:

{
  "email": "budi@example.com"
}
Contoh response:

{
  "success": true,
  "message": "Kode OTP baru telah dikirim ke email"
}
4. Login
Endpoint:

POST /api/auth/login
Contoh request:

{
  "identifier": "budis",
  "password": "Password123!"
}
Contoh response:

{
  "success": true,
  "message": "Login berhasil",
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Validasi:

Identifier dan password wajib diisi.
Jika login gagal, frontend menampilkan pesan error dari backend.
Token disimpan ke localStorage setelah login berhasil.
Project Structure
Berikut struktur folder utama project:

app/                 # Routing dan halaman utama aplikasi Next.js
components/         # Komponen UI reusable, termasuk auth flow
  auth/              # Login, Register, Verify OTP
public/             # Asset statis seperti gambar dan favicon
services/           # Tempat menampung logika API / service layer (kosong/siap dikembangkan)
next.config.ts      # Konfigurasi Next.js
package.json        # Dependency dan script project
.env                # Konfigurasi environment variable lokal
Penjelasan folder penting:

app/page.tsx: mengatur alur halaman autentikasi utama.
components/auth/login.tsx: tampilan dan logika login.
components/auth/register.tsx: tampilan dan logika registrasi.
components/auth/verify-otp.tsx: tampilan dan logika verifikasi OTP.
.env: menyimpan URL backend yang dipakai oleh frontend.
Tech Stack
Teknologi yang digunakan dalam project ini:

Next.js 16
React 19
TypeScript
Tailwind CSS
Axios
Material Icons
ESLint
Local Setup
Berikut langkah setup project di local.

Prerequisites
Sebelum menjalankan project, pastikan perangkat Anda sudah menyiapkan:

Node.js 20+ (disarankan versi 20.18 atau 22)
npm atau pnpm
Git
Koneksi internet untuk mengakses backend API
1. Clone repository
git clone <repository-url>
cd saku-sehat-frontend
2. Install dependencies
npm install
3. Konfigurasi Environment Variable
Buat file .env jika belum ada, lalu isi:

NEXT_PUBLIC_API_URL=http://localhost:3001
Jika Anda menggunakan backend yang sudah di-deploy, gunakan URL backend tersebut, misalnya:

NEXT_PUBLIC_API_URL=https://saku-sehat-backend.vercel.app
4. Jalankan project secara local
npm run dev
Setelah itu buka browser ke:

http://localhost:3000
Documentation
Dokumentasi resmi teknologi yang digunakan:

Next.js: https://nextjs.org/docs
React: https://react.dev/
TypeScript: https://www.typescriptlang.org/docs/
Tailwind CSS: https://tailwindcss.com/docs
Axios: https://axios-http.com/docs/intro
Commit Format Standards
Repository ini disarankan menggunakan format commit message yang konsisten seperti berikut:

type(scope): subject
Contoh:

feat(auth): add login page UI
fix(otp): handle expired otp state
docs(readme): update project documentation
chore(deps): upgrade next.js to latest patch
Standar yang umum dipakai:

feat: penambahan fitur baru
fix: perbaikan bug
docs: perubahan dokumentasi
chore: tugas maintenance seperti update dependency
refactor: perbaikan struktur kode tanpa mengubah perilaku