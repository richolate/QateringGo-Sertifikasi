# QateringGo Admin Dashboard UI Mockup

Prototype antarmuka web statis untuk panel admin "QateringGo" dengan fokus pada alur pembuatan laporan pesanan.

## Struktur Halaman

- `login.html` &mdash; Halaman login modern dengan dropdown peran (default Admin), pesan umpan balik, dan tautan menuju registrasi.
- `register.html` &mdash; Formulir pendaftaran akun admin baru dengan validasi dasar dan pengalihan otomatis kembali ke login.
- `dashboard.html` &mdash; Dashboard ringkasan sesuai mockup, berisi kartu metrik, area insight (tren & kontribusi vendor), tabel pesanan korporat, dan shortcut halaman.
- `report.html` &mdash; Halaman khusus untuk membuat laporan pesanan dengan form rentang tanggal, pesan validasi, dan tips singkat.
- `report-preview.html` &mdash; Pratinjau laporan dengan tabel data dummy, opsi format (PDF/Excel), dan tombol unduh laporan.
- `report-empty.html` &mdash; Keadaan alternatif ketika rentang tanggal tidak memiliki data, lengkap dengan pesan dan ilustrasi kosong.

Semua halaman berbagi gaya melalui `assets/css/styles.css`, logonya berada di `assets/img/qateringgo-logo.svg`, dan interaksi alur diatur oleh `assets/js/app.js`.

## Skenario Navigasi

> Semua skenario dapat dijalankan hanya dengan membuka file HTML secara langsung di browser.

1. **Login → Register → Login**: Dari `login.html`, klik *Daftar sekarang*, submit formulir di `register.html`, maka sistem akan kembali ke login dengan pesan sukses.
2. **Login → Dashboard → Buat Laporan Pesanan**: Login mengarahkan ke `dashboard.html`. Pilih menu/sidebar *Buat Laporan Pesanan* untuk membuka `report.html`.
3. **Buat Laporan Pesanan (rentang tidak valid)**: Di `report.html`, masukkan tanggal sebelum September 2025 atau melebihi hari ini lalu klik *Tampilkan Pratinjau*. Muncul pesan "Tanggal tidak valid" dan Anda dialihkan ke `report-empty.html` dengan status "Tidak Ada Data Ditemukan".
4. **Buat Laporan Pesanan → Pratinjau → Generate Report**: Dari `report.html`, gunakan rentang valid (contoh 1–31 Oktober 2025). Halaman `report-preview.html` akan tampil dan tombol *Generate Report* mengunduh berkas dummy (CSV/PDF sesuai pilihan format).

## Cara Menggunakan

1. Buka folder proyek ini.
2. Klik dua kali file HTML yang ingin Anda tinjau atau buka melalui browser favorit Anda (`Ctrl + O` &rarr; pilih file).
3. Ikuti skenario navigasi di atas untuk menelusuri seluruh alur laporan.

## Catatan Desain

- Palet warna menggabungkan hijau tua kebiruan untuk kepercayaan dan kontras dengan ruang putih yang luas.
- Tipografi menggunakan font sans-serif modern dengan fokus pada keterbacaan data.
- Setiap halaman dirancang responsif untuk tampilan desktop hingga tablet.
