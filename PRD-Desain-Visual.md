# PRD — Desain Visual
## Website Penilaian Risiko Kesehatan Mental Berbasis Logika Fuzzy Mamdani

**Mata Kuliah:** Metode Numerik
**Jenis Dokumen:** Product Requirements Document (Design / Visual)
**Tema:** Blue Lagoon
**Status:** Draft v1.0

> Dokumen ini melengkapi **PRD System Overview**. Fokusnya pada arah visual: palet warna, tipografi, layout, komponen, dan motion. Kebutuhan fungsional & logika fuzzy ada di dokumen terpisah.

---

## 1. Arah Desain (Design Direction)

### 1.1 Konsep
Tema **Blue Lagoon** — gradasi dari biru langit cerah menuju kedalaman laut dan kegelapan tinta. Konsep ini cocok untuk topik kesehatan mental: nuansa biru memberi kesan **tenang, fokus, dan terpercaya**, sekaligus kedalaman warna (deep space → ink black) memberi dimensi "kedalaman pikiran" yang pas dengan tema introspeksi.

### 1.2 Mood
Tenang · profesional · jernih · modern · sedikit "cosmic/oceanic depth".

### 1.3 Prinsip
- **Latar gelap-kebiruan** sebagai dasar (deep space → ink black), dengan elemen interaktif berwarna biru cerah agar menonjol.
- Satu elemen signature yang diingat: **gauge risiko + kurva membership** sebagai pusat perhatian hasil.
- Disiplin di sekeliling: ruang kosong (whitespace) cukup, tipografi rapi, dekorasi seperlunya.

---

## 2. Palet Warna — Blue Lagoon

### 2.1 Daftar Warna
| Nama | Hex | Peran Utama |
|------|-----|-------------|
| Fresh Sky | `#00a6fb` | Aksen utama / CTA / highlight aktif |
| Steel Blue | `#0582ca` | Aksen sekunder / link / state hover |
| Baltic Blue | `#006494` | Warna pendukung / border aktif / ikon |
| Deep Space Blue | `#003554` | Permukaan card / panel / section |
| Ink Black | `#051923` | Background utama / dasar halaman |

### 2.2 Token Warna (saran penerapan)
```css
:root {
  /* Base */
  --bg-base:        #051923;  /* Ink Black — background halaman */
  --surface:        #003554;  /* Deep Space Blue — card, panel */
  --surface-raised: #024A6B;  /* turunan: card di atas card / hover surface */

  /* Accent */
  --accent:         #00a6fb;  /* Fresh Sky — tombol utama, highlight */
  --accent-2:       #0582ca;  /* Steel Blue — hover, aksen sekunder */
  --accent-3:       #006494;  /* Baltic Blue — border, ikon, pendukung */

  /* Teks */
  --text-primary:   #EAF6FF;  /* hampir putih kebiruan — teks utama */
  --text-secondary: #9CC4DC;  /* biru pucat — teks sekunder/caption */
  --text-muted:     #5E879E;  /* teks redup / placeholder */

  /* Garis & state */
  --border:         #0A3247;  /* border halus */
  --border-active:  #00a6fb;  /* border aktif/fokus */
}
```

### 2.3 Warna Semantik Hasil Risiko
Tetap dalam keluarga tema, namun cukup berbeda agar kategori mudah dibedakan:
| Kategori | Warna | Hex saran | Catatan |
|----------|-------|-----------|---------|
| Risiko Rendah | Cyan cerah | `#00a6fb` | Aman, sejalan dengan aksen utama |
| Risiko Sedang | Amber/teal hangat | `#f6c453` | Kontras hangat untuk "waspada" |
| Risiko Tinggi | Coral/merah lembut | `#ff5d6c` | Sinyal perhatian, tidak terlalu agresif |

> Penggunaan warna hangat hanya pada indikator hasil, agar tetap terbaca jelas di atas latar biru gelap.

### 2.4 Gradien Signature
- **Hero / aksen besar:** gradien dari `#00a6fb` → `#006494` → `#003554` (langit ke laut dalam).
- **Background ambient:** radial gelap dari `#003554` (atas) memudar ke `#051923` (bawah) untuk kesan kedalaman.

---

## 3. Tipografi

### 3.1 Pasangan Font (saran)
| Peran | Font | Alasan |
|-------|------|--------|
| Display / Heading | **Space Grotesk** atau **Sora** | Karakter modern-teknikal, pas dengan nuansa "cosmic/numerik" |
| Body / UI | **Inter** | Sangat terbaca, netral, cocok untuk form & angka |
| Data / Mono (opsional) | **JetBrains Mono** / **IBM Plex Mono** | Untuk menampilkan skor & nilai fuzzy agar terasa "presisi" |

### 3.2 Skala Tipe (saran)
| Token | Ukuran | Penggunaan |
|-------|--------|------------|
| Display | 48–64px | Judul hero landing |
| H1 | 32–40px | Judul section |
| H2 | 24–28px | Sub-judul |
| Body L | 18px | Teks pengantar |
| Body | 16px | Teks umum, label form |
| Caption | 13–14px | Disclaimer, keterangan grafik |

- Heading: bobot 600–700, letter-spacing sedikit rapat pada display.
- Body: bobot 400–500, line-height ±1.6 untuk kenyamanan baca di latar gelap.
- Angka skor besar (hasil): gunakan font mono/display dengan bobot tebal agar jadi fokus.

---

## 4. Layout & Struktur Visual

### 4.1 Topbar
- **Sticky, transparan** di atas hero, lalu berubah jadi solid `--surface` dengan blur halus saat scroll.
- Kiri: nama/logo proyek (teks). Kanan: tautan anchor (Pengantar · Kuisioner · Hasil).
- Garis bawah tipis `--border` saat solid.

```
┌──────────────────────────────────────────────┐
│  ◆ FuzzyMind        Pengantar  Kuisioner  Hasil│
└──────────────────────────────────────────────┘
```

### 4.2 Section 1 — Landing / Hero + Tim
```
┌──────────────────────────────────────────────┐
│  (ambient gradient biru-gelap, glow halus)     │
│                                                │
│     Cek Risiko Kesehatan Mental-mu             │
│     dengan Logika Fuzzy Mamdani                │
│     [sub-teks pengantar singkat]               │
│                                                │
│            [ Mulai Kuisioner ↓ ]               │
│                                                │
│  ── Tim Pengembang ───────────────────         │
│  [card] [card] [card] [card]                   │
└──────────────────────────────────────────────┘
```
- **Hero:** judul display besar dengan gradien aksen pada sebagian kata; sub-teks `--text-secondary`; tombol CTA `--accent`.
- **Kartu tim:** grid kartu kecil `--surface`, border halus, avatar/inisial bulat dengan ring `--accent-3`, nama + NIM/role.
- Indikator scroll (panah halus) di bawah hero.
- Disclaimer non-medis: caption kecil `--text-muted`.

### 4.3 Section 2 — Form Kuisioner
```
┌──────────────────────────────────────────────┐
│  Kuisioner Tingkat Stres                       │
│  ┌──────────────────────────────────────────┐ │
│  │ 1. Pertanyaan ...           [0 ─●──── 10] │ │
│  │ 2. Pertanyaan ...           [0 ──●─── 10] │ │
│  │ ...                                        │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │ Jam tidur per malam   [0 ───●──── 12]  6j │ │
│  └──────────────────────────────────────────┘ │
│  Skor stres saat ini: 36 / 100                 │
│            [ Hitung Risiko ]                   │
└──────────────────────────────────────────────┘
```
- Form dibungkus dalam **card besar** `--surface` dengan sudut membulat (radius ±16px) dan padding lega.
- Tiap soal: label di kiri, **slider 0–10** dengan track gelap & thumb `--accent`, nilai terpilih ditampilkan di kanan (font mono).
- Slider jam tidur dibedakan visualnya (mis. label "jam" + ikon bulan/tidur kecil `--accent-3`).
- **Skor stres live** ditampilkan di bawah daftar soal.
- Tombol **"Hitung Risiko"**: penuh-warna `--accent` saat aktif; redup/disabled saat belum semua terisi.

### 4.4 Section 3 — Proses
- Overlay/animasi singkat: ripple atau gelombang biru (ocean ripple) selama <1 detik, lalu lanjut ke hasil. Tidak menampilkan detail tahapan fuzzy.

### 4.5 Section 4 — Hasil
```
┌──────────────────────────────────────────────┐
│  Hasil Penilaian                               │
│  ┌────────────────┐  ┌──────────────────────┐ │
│  │   😟  SEDANG    │  │  Gauge 0─────●───100  │ │
│  │   Skor: 40      │  │  (zona warna kategori)│ │
│  │   Rentang 40–65 │  └──────────────────────┘ │
│  └────────────────┘                            │
│  ┌──────────────────────────────────────────┐ │
│  │  Grafik Membership Function (kurva fuzzy)  │ │
│  │  Rendah / Sedang / Tinggi + penanda hasil  │ │
│  └──────────────────────────────────────────┘ │
│  Ringkasan input: Stres 36 · Tidur 6 jam       │
│            [ Isi Ulang Kuisioner ]             │
└──────────────────────────────────────────────┘
```
- **Kartu kategori:** emoji besar + label kategori + skor numerik besar (font mono/display) + rentang. Aksen warna mengikuti warna semantik kategori.
- **Gauge:** setengah lingkaran / bar 0–100 dengan zona warna (cyan→amber→coral) dan jarum/penanda di posisi skor.
- **Grafik membership:** chart kurva 3 himpunan output (Rendah/Sedang/Tinggi), dengan garis vertikal penanda skor hasil. Warna kurva memakai turunan tema.
- Ringkasan input dalam baris caption.
- Tombol **"Isi Ulang Kuisioner"** sebagai aksi sekunder (outline `--accent-3`).

---

## 5. Komponen UI

| Komponen | Spesifikasi visual |
|----------|--------------------|
| **Card / Panel** | bg `--surface`, radius 16px, border `--border` 1px, shadow lembut kebiruan, padding 24–32px |
| **Tombol Primer** | bg `--accent`, teks `--bg-base` (gelap) bobot 600, radius 12px, hover → `--accent-2`, ada state disabled redup |
| **Tombol Sekunder** | transparan, border `--accent-3`, teks `--accent`, hover isi tipis |
| **Slider** | track `--border` gelap, fill `--accent`, thumb bulat `--accent` dengan glow halus saat fokus |
| **Topbar** | transparan → solid `--surface` + backdrop-blur saat scroll |
| **Badge kategori** | pill berwarna semantik, teks kontras |
| **Chart** | latar transparan, grid garis `--border` tipis, kurva pakai aksen tema, label `--text-secondary` |
| **Avatar tim** | lingkaran inisial, ring `--accent-3` |

### Radius & Spacing (saran)
- Radius: kecil 8px · sedang 12px · besar 16px.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Lebar konten maksimum: ±960–1080px, terpusat.

---

## 6. Motion & Interaksi

| Momen | Animasi | Catatan |
|-------|---------|---------|
| Load hero | Fade + slide-up judul & CTA | Halus, ±400ms |
| Scroll reveal | Section muncul fade-up saat masuk viewport | Sekali per section |
| Hover tombol/slider | Transisi warna & sedikit glow | ±150–200ms |
| Proses hitung | Ocean ripple / gelombang singkat | <1 detik |
| Gauge hasil | Jarum/fill beranimasi dari 0 ke skor | Ease-out, ±800ms |
| Kurva membership | Garis menggambar saat muncul (opsional) | Halus |

- **Hormati `prefers-reduced-motion`**: matikan animasi non-esensial bila pengguna memintanya.

---

## 7. Aksesibilitas & Responsif

| ID | Kebutuhan |
|----|-----------|
| AX-01 | Kontras teks vs latar memenuhi minimal WCAG AA (teks utama `--text-primary` di atas `--bg-base`/`--surface`). |
| AX-02 | Fokus keyboard terlihat jelas (ring `--accent`) pada slider, tombol, link. |
| AX-03 | Slider dapat dioperasikan via keyboard (panah) dan punya label terbaca screen reader. |
| AX-04 | Warna tidak jadi satu-satunya penanda kategori — selalu ada label teks + emoji. |
| RS-01 | Layout responsif: hero & section menyusun ulang ke 1 kolom di mobile. |
| RS-02 | Grid kartu tim 4 kolom (desktop) → 2/1 kolom (tablet/mobile). |
| RS-03 | Gauge & chart menyesuaikan lebar kontainer (responsive SVG). |

---

## 8. Ringkasan Token (Quick Reference)

```
Background      #051923  (Ink Black)
Surface         #003554  (Deep Space Blue)
Accent          #00a6fb  (Fresh Sky)
Accent-2        #0582ca  (Steel Blue)
Accent-3        #006494  (Baltic Blue)
Text primary    #EAF6FF
Text secondary  #9CC4DC

Risiko Rendah   #00a6fb
Risiko Sedang   #f6c453
Risiko Tinggi   #ff5d6c

Display font    Space Grotesk / Sora
Body font       Inter
Mono font       JetBrains Mono (opsional)

Radius          8 / 12 / 16 px
Max width       960–1080 px
```

---

## 9. Out of Scope (dokumen ini)
- Logika & rumus fuzzy Mamdani (lihat PRD System Overview).
- Kebutuhan fungsional detail.
- Implementasi kode aktual.
