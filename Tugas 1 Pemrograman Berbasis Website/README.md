# 🎓 SITTA - Sistem Pemesanan Bahan Ajar UT

**Sistem Informasi Tata Tulis Administrasi** untuk pemesanan dan distribusi bahan ajar di Universitas Terbuka.

---

## 📁 Struktur File

```
sitta-project/
│
├── index.html          # File HTML utama (struktur website)
├── styles.css          # File CSS eksternal (styling)
├── script.js           # File JavaScript eksternal (interaktivitas)
└── README.md           # Dokumentasi ini
```

---

## 🚀 Cara Menggunakan

### 1. **Setup Awal**
- Download ketiga file: `index.html`, `styles.css`, dan `script.js`
- Letakkan semua file dalam **satu folder yang sama**
- Buka file `index.html` menggunakan browser (Chrome, Firefox, Edge, dll)

### 2. **Tidak Perlu Server**
Website ini bisa langsung dibuka tanpa web server karena:
- Menggunakan HTML, CSS, dan JavaScript murni
- Data disimpan di localStorage browser
- Tidak ada dependencies eksternal

---

## 🎯 Fitur Utama

### 1. **Form Pemesanan Bahan Ajar** 📦
- Input data mahasiswa (NIM, Nama, Email, Telepon)
- Pemilihan Program Studi dan Mata Kuliah
- Input alamat pengiriman lengkap
- Validasi form real-time
- Alert feedback untuk setiap aksi

### 2. **Riwayat Pesanan** 📋
- Tabel pesanan dengan informasi lengkap
- Statistik: Total Pesanan, Selesai, Dalam Proses
- Fitur search berdasarkan NIM atau Nama
- Filter berdasarkan status (Pending, Proses, Selesai, Batal)
- Tombol aksi: Detail, Update Status, Hapus

### 3. **Tracking Distribusi** 🚚
- Input nomor order untuk tracking
- Timeline visual status pengiriman
- Estimasi waktu penyelesaian
- Status real-time

---

## 🛠️ Teknologi yang Digunakan

### **1. HTML5 (index.html)**
- Struktur semantik: `<header>`, `<main>`, `<section>`, `<footer>`
- Form elements dengan atribut validasi
- Tabel data yang responsive
- Modal untuk detail pesanan

### **2. CSS3 (styles.css)**
- CSS Variables untuk tema konsisten
- Flexbox & Grid Layout
- Animasi & Transisi
- Media queries untuk responsive design
- Gradient backgrounds
- Shadow effects

### **3. JavaScript ES6 (script.js)**
- DOM Manipulation
- Event Handling
- Form Validation
- localStorage API
- Array methods (filter, map, find)
- Template literals
- Arrow functions

---

## 🎮 Panduan Penggunaan

### **A. Membuat Pesanan Baru**
1. Klik tab **"Pesan Bahan Ajar"**
2. Isi semua form yang bertanda bintang merah (*)
3. Pilih Program Studi → Mata Kuliah akan muncul otomatis
4. Klik **"Submit Pesanan"**
5. Pesanan akan tersimpan dan muncul di tab Riwayat

### **B. Melihat Riwayat Pesanan**
1. Klik tab **"Riwayat Pesanan"**
2. Gunakan **search box** untuk mencari pesanan
3. Gunakan **filter** untuk menyaring berdasarkan status
4. Klik tombol aksi:
   - 👁️ **Detail**: Lihat info lengkap
   - 🔄 **Status**: Update status pesanan
   - 🗑️ **Hapus**: Hapus pesanan

### **C. Tracking Pesanan**
1. Klik tab **"Status Distribusi"**
2. Masukkan **nomor order** (contoh: ORD-1001)
3. Klik **"Track Pesanan"**
4. Lihat timeline progress pesanan

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Fungsi |
|----------|--------|
| `Ctrl/Cmd + S` | Submit form (di tab Pesan) |
| `Ctrl/Cmd + R` | Reset form |
| `Ctrl/Cmd + F` | Focus ke search box |
| `ESC` | Tutup modal |

---

## 🔧 Fitur Developer

Buka **Console Browser** (F12) dan coba perintah ini:

```javascript
// Tambah data demo untuk testing
addDemoData()

// Hapus semua data
clearAllData()

// Export data ke JSON
exportToJSON()

// Print detail pesanan
printOrderDetail("ORD-1001")
```

---

## 💾 Data Storage

Data disimpan menggunakan **localStorage** browser:
- Data persisten (tidak hilang saat refresh)
- Tersimpan di browser lokal
- Tidak dikirim ke server
- Key: `sittaOrders`

---

## 🎨 Fitur UI/UX

### **Desain Modern**
- Gradient background yang menarik
- Card-based layout
- Shadow effects untuk depth
- Smooth animations & transitions

### **Responsive Design**
- Desktop: Grid layout 2-4 kolom
- Tablet: Grid layout 1-2 kolom
- Mobile: Single column, stacked navigation

### **Interactive Elements**
- Hover effects pada buttons & rows
- Active states pada tabs
- Loading animations
- Status badges dengan warna berbeda

### **Accessibility**
- Label yang jelas pada form
- Contrast ratio yang baik
- Keyboard navigation support
- Error messages yang deskriptif

---

## 🐛 Troubleshooting

### **Data Tidak Tersimpan?**
- Pastikan browser mendukung localStorage
- Jangan gunakan mode Incognito/Private
- Clear cache jika ada masalah

### **Mata Kuliah Tidak Muncul?**
- Pastikan sudah memilih Program Studi terlebih dahulu
- Refresh halaman jika ada masalah

### **CSS/JS Tidak Load?**
- Pastikan ketiga file berada di folder yang sama
- Periksa nama file: `styles.css` dan `script.js`
- Cek Console browser untuk error

---

## 📝 Penjelasan Alur Kerja

### **1. Flow Pemesanan**
```
User Input Form → Validasi → Submit → Simpan ke Array → 
localStorage → Update UI → Tampilkan Alert
```

### **2. Flow Tracking**
```
Input Order Number → Cari di Array → Generate Timeline → 
Tampilkan Status → Estimasi Waktu
```

### **3. Flow Manipulasi Data**
```
User Action (Update/Delete) → Confirm → Update Array → 
localStorage → Re-render Table → Update Stats
```

---

## 🎯 Argumentasi Desain

### **Mengapa Menggunakan Tab?**
- Mengurangi scrolling
- Fokus pada satu task
- Clean & organized interface

### **Mengapa localStorage?**
- Tidak perlu backend/database
- Data persisten untuk demo
- Quick prototyping
- Client-side processing

### **Mengapa Modular Files?**
- Maintainability tinggi
- Separation of concerns
- Mudah di-debug
- Best practice web development

### **Mengapa Validasi Real-time?**
- Better user experience
- Immediate feedback
- Reduce error rate
- Modern web standard

---

## 📱 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 👨‍💻 Development

**Teknologi**: Pure HTML5, CSS3, JavaScript ES6  
**Framework**: None (Vanilla JS)  
**Dependencies**: None  
**Build Tools**: None required  

---
