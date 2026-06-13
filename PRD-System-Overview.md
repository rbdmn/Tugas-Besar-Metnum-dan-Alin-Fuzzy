# PRD — System Overview
## Website Penilaian Risiko Kesehatan Mental Berbasis Logika Fuzzy Mamdani

**Mata Kuliah:** Metode Numerik
**Jenis Dokumen:** Product Requirements Document (System Overview)
**Stack:** React + Next.js (full client-side)
**Status:** Draft v1.0

> Dokumen ini hanya mencakup **system overview / kebutuhan fungsional**. Spesifikasi desain (visual, layout, warna, tipografi) akan ditulis terpisah pada file PRD desain.

---

## 1. Ringkasan Produk

Website edukatif yang menghitung **tingkat risiko kesehatan mental** seorang mahasiswa menggunakan **algoritma Logika Fuzzy metode Mamdani**. Pengguna mengisi kuisioner singkat (10 soal stres + 1 input jam tidur), lalu sistem memproses input tersebut melalui tahapan fuzzy Mamdani dan menampilkan hasil risiko (Rendah / Sedang / Tinggi) dengan visualisasi yang menarik.

### 1.1 Tujuan
- Mendemonstrasikan implementasi nyata algoritma fuzzy Mamdani sebagai studi kasus tugas besar Metode Numerik.
- Menyediakan antarmuka yang ramah pengguna sehingga konsep matematis fuzzy mudah dipahami secara visual.
- Menjadi produk yang dapat di-deploy dan dipresentasikan (mis. ke Vercel).

### 1.2 Sasaran Pengguna
- Mahasiswa (responden kuisioner).
- Dosen/penguji (mengevaluasi implementasi).

### 1.3 Batasan (Scope)
- **Tidak ada backend / database.** Seluruh perhitungan dilakukan client-side.
- **Hasil tidak disimpan** — sekali tampil, tidak ada riwayat maupun export.
- Bukan alat diagnosis medis; bersifat edukatif/simulasi.

---

## 2. Keputusan Arsitektur

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| Framework | Next.js (App Router) + React | Sesuai permintaan; mudah deploy ke Vercel |
| Lokasi komputasi | **Full client-side** | Tidak butuh server, gratis di-deploy, kode transparan untuk dinilai, perhitungan ringan |
| Bahasa | TypeScript (disarankan) | Type-safety untuk fungsi matematis fuzzy |
| State | React state lokal (`useState`/`useReducer`) | Tidak perlu state global; data hidup selama sesi |
| Penyimpanan | Tidak ada | Sesuai keputusan: hasil cukup ditampilkan |
| Charting | Library chart (mis. Recharts) atau SVG custom | Untuk membership function & gauge |

---

## 3. Struktur Halaman & Alur Pengguna

Aplikasi berupa **single page** dengan alur scroll vertikal (one-page flow):

```
[Landing / Pengantar + Tim]
            │  (scroll ke bawah)
            ▼
[Form Kuisioner: 10 soal stres + 1 input jam tidur]
            │  (klik "Hitung Risiko" setelah semua terisi)
            ▼
[Proses perhitungan fuzzy Mamdani — singkat]
            │
            ▼
[Hasil: kategori risiko + emoji + rentang + grafik]
```

### 3.1 Section 1 — Landing Page (Pengantar & Tim)
**Fungsi:** Memberikan konteks dan memperkenalkan tim.

Kebutuhan konten:
- Judul proyek & deskripsi singkat (apa itu, untuk apa).
- Penjelasan ringkas konsep: penilaian risiko kesehatan mental dengan fuzzy Mamdani.
- **Pengenalan tim** (nama anggota, NIM/role — placeholder, diisi nanti).
- Tombol/indikator ajakan untuk scroll ke kuisioner.
- Disclaimer: alat edukatif, bukan diagnosis medis.

### 3.2 Section 2 — Form Kuisioner
**Fungsi:** Mengumpulkan input pengguna. Ditampilkan sebagai **satu form panjang** (semua soal terlihat sekaligus).

**Input A — 10 Soal Stres** (masing-masing skala 0–10):

| No | Pertanyaan |
|----|------------|
| 1 | Seberapa sering kamu merasa kewalahan dengan tugas kuliah? |
| 2 | Seberapa sulit kamu berkonsentrasi saat belajar? |
| 3 | Seberapa sering kamu merasa cemas tanpa alasan yang jelas? |
| 4 | Seberapa sering kamu merasa tidak punya waktu istirahat? |
| 5 | Seberapa sering kamu merasa lelah meskipun sudah tidur? |
| 6 | Seberapa sulit kamu menikmati hal-hal yang biasanya menyenangkan? |
| 7 | Seberapa sering kamu merasa tidak mampu memenuhi ekspektasi? |
| 8 | Seberapa sering kamu mengalami sakit kepala atau tegang otot? |
| 9 | Seberapa sering kamu merasa mood kamu berubah-ubah? |
| 10 | Seberapa sering kamu merasa khawatir tentang masa depan? |

- Tiap soal: input skala 0–10 (slider atau pilihan angka).
- Skor stres = jumlah seluruh jawaban (karena 10 soal × maks 10 = maks 100), menghasilkan skala **0–100**.

**Input B — Jam Tidur** (skala 0–12):
- Satu input untuk rata-rata jam tidur per malam (0–12 jam).

**Aturan interaksi:**
- Tombol **"Hitung Risiko"** aktif hanya jika **semua** input (10 soal + jam tidur) sudah terisi.
- Tampilkan skor stres secara live (opsional) saat user mengisi.
- Validasi: nilai dalam rentang yang benar, tidak ada field kosong.

### 3.3 Section 3 — Proses Perhitungan
**Fungsi:** Menjalankan algoritma fuzzy Mamdani dan menjembatani ke hasil.

- Saat tombol ditekan, jalankan fungsi perhitungan fuzzy (lihat Bagian 4).
- Tampilkan indikator proses singkat (mis. loading/animasi pendek). **Tidak perlu menampilkan keempat tahap fuzzy secara mendetail kepada pengguna** — proses berlangsung di balik layar.
- Setelah selesai, otomatis tampilkan/scroll ke section hasil.

### 3.4 Section 4 — Output / Hasil
**Fungsi:** Menampilkan hasil risiko secara menarik dan informatif.

Kebutuhan tampilan:
- **Kategori risiko**: Rendah / Sedang / Tinggi.
- **Emoji** sesuai kategori (mis. 😌 Rendah · 😟 Sedang · 😰 Tinggi).
- **Nilai numerik (skor risiko 0–100)** beserta **rentang** kategorinya.
- **Gauge / bar** menunjukkan posisi skor risiko pada skala 0–100.
- **Grafik membership function** (kurva himpunan fuzzy) — lihat Bagian 5.
- Ringkasan singkat input pengguna (skor stres & jam tidur).
- Tombol untuk mengulang/mengisi ulang kuisioner.

---

## 4. Spesifikasi Mesin Fuzzy Mamdani

> Implementasi mengacu pada definisi himpunan & rule dari studi kasus. Disederhanakan pada level UI, namun lengkap pada level komputasi.

### 4.1 Variabel Input

**Stres (0–100):**
| Himpunan | Tipe | Parameter |
|----------|------|-----------|
| Rendah | Trapesium | [0, 0, 20, 40] |
| Sedang | Segitiga | [30, 50, 70] |
| Tinggi | Trapesium | [60, 80, 100, 100] |

**Jam Tidur (0–12):**
| Himpunan | Tipe | Parameter |
|----------|------|-----------|
| Kurang | Trapesium | [0, 0, 4, 6] |
| Cukup | Segitiga | [5, 7, 9] |
| Banyak | Trapesium | [8, 10, 12, 12] |

### 4.2 Variabel Output

**Risiko (0–100):**
| Himpunan | Tipe | Parameter |
|----------|------|-----------|
| Rendah | Trapesium | [0, 0, 25, 45] |
| Sedang | Segitiga | [35, 55, 75] |
| Tinggi | Trapesium | [65, 80, 100, 100] |

### 4.3 Rule Base (9 rule)

| Stres \ Tidur | Kurang | Cukup | Banyak |
|---------------|--------|-------|--------|
| **Rendah** | Sedang | Rendah | Rendah |
| **Sedang** | Tinggi | Sedang | Sedang |
| **Tinggi** | Tinggi | Tinggi | Sedang |

### 4.4 Tahapan Algoritma (internal)
1. **Fuzzifikasi** — hitung derajat keanggotaan input stres & jam tidur ke tiap himpunan.
2. **Inferensi** — operator **MIN** (AND) untuk tiap rule → derajat aktivasi (α).
3. **Agregasi** — gabungkan output rule per himpunan output (ambil α maksimum tiap himpunan, clip).
4. **Defuzzifikasi** — metode **Centroid** untuk menghasilkan skor risiko akhir (0–100).

### 4.5 Pemetaan Skor → Kategori
- Skor risiko di-mapping ke kategori berdasarkan derajat keanggotaan tertinggi pada himpunan output, atau berdasarkan rentang nilai centroid.
- Saran rentang tampilan: Rendah (≈0–40), Sedang (≈40–65), Tinggi (≈65–100).

### 4.6 Test Case Validasi (acuan)
| Test Case | Stres | Jam Tidur | Output z* | Kategori |
|-----------|-------|-----------|-----------|----------|
| TC1 | 19 | 8 jam | ≈ 20 | Rendah |
| TC2 | 36 | 6 jam | ≈ 40 | Sedang |
| TC3 | 75 | 4 jam | ≈ 85 | Tinggi |

> Hasil implementasi harus konsisten dengan ketiga test case di atas.

---

## 5. Kebutuhan Visualisasi

| Visualisasi | Deskripsi | Prioritas |
|-------------|-----------|-----------|
| **Membership Function** | Kurva himpunan fuzzy (Rendah/Sedang/Tinggi) untuk variabel risiko (dan opsional input). Tandai posisi nilai hasil pengguna pada kurva. | Wajib |
| **Gauge / Bar Risiko** | Indikator skor risiko akhir pada skala 0–100, dengan zona warna per kategori. | Wajib |

> Visualisasi rule aktif dan animasi defuzzifikasi **tidak termasuk** scope versi ini.

---

## 6. Kebutuhan Fungsional (Functional Requirements)

| ID | Kebutuhan |
|----|-----------|
| FR-01 | Sistem menampilkan landing page berisi pengantar proyek & profil tim. |
| FR-02 | Sistem menyediakan form berisi 10 soal stres (skala 0–10) dalam satu halaman. |
| FR-03 | Sistem menyediakan satu input jam tidur (0–12). |
| FR-04 | Sistem menghitung skor stres = jumlah jawaban 10 soal (0–100). |
| FR-05 | Tombol hitung hanya aktif bila seluruh input valid & terisi. |
| FR-06 | Sistem menjalankan algoritma fuzzy Mamdani secara client-side. |
| FR-07 | Sistem menampilkan kategori risiko, emoji, nilai numerik, dan rentang. |
| FR-08 | Sistem menampilkan grafik membership function & gauge risiko. |
| FR-09 | Sistem menyediakan opsi mengisi ulang kuisioner. |
| FR-10 | Hasil tidak disimpan dan tidak dapat di-export. |

## 7. Kebutuhan Non-Fungsional

| ID | Kebutuhan |
|----|-----------|
| NFR-01 | Perhitungan selesai instan (<1 detik) di sisi klien. |
| NFR-02 | Responsif di desktop & mobile. |
| NFR-03 | Kode perhitungan fuzzy terstruktur & dapat ditelusuri untuk penilaian. |
| NFR-04 | Aplikasi dapat di-deploy statis (mis. Vercel) tanpa server tambahan. |
| NFR-05 | Disclaimer non-medis tampil jelas. |

---

## 8. Saran Struktur Proyek (opsional)

```
/app
  /page.tsx              # one-page: landing + form + hasil
/components
  /Landing.tsx
  /Questionnaire.tsx
  /ResultDisplay.tsx
  /charts/
    MembershipChart.tsx
    RiskGauge.tsx
/lib
  /fuzzy/
    membership.ts        # fungsi trapesium & segitiga
    rules.ts             # rule base
    mamdani.ts           # fuzzifikasi→inferensi→agregasi→defuzzifikasi
    types.ts
  /questions.ts          # data 10 soal
```

---

## 9. Out of Scope (versi ini)
- Penyimpanan & riwayat hasil.
- Export PDF/gambar.
- Backend / autentikasi / database.
- Visualisasi rule aktif & animasi defuzzifikasi.
- Spesifikasi desain visual (dibahas di PRD terpisah).
