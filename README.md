# 🌃 Neo Shangri-La — Cyberpunk Text RPG

Game RPG berbasis teks dengan tema cyberpunk. Jelajahi kota, berdagang, crafting, dan selesaikan misi!

## 🎮 Fitur
- **Karakter**: Level, EXP, Health, Armor, Shield, BTC, Units
- **Inventory**: Item dengan stats (DMG, Armor, Crit), equipment slots
- **Eksplorasi**: Pusat Kota, Jalan Pasar, Area Komersial, Pantai, dll
- **NPC Trading**: Pos Perdagangan Lee, Toko Trinoky, Kantor Bursa Arasaka
- **Bank Arasaka**: Setor/Tarik BTC & Barang, Upgrade Berangkas
- **Terminal**: Buka Kontainer, Kunci Rahasia, Serang-Paksa
- **Crafting**: Molecular Print (armor & senjata)
- **Misi**: Timer-based missions dengan loot & rewards
- **Auto-Save**: Progress tersimpan di localStorage

## 🚀 Deploy ke GitHub Pages
1. Buat repository baru di GitHub
2. Upload semua file ke repository
3. Buka **Settings → Pages → Source → Deploy from a branch → `main`**
4. Tunggu beberapa menit, game akan live di `https://username.github.io/repo-name`

## 🛠️ Struktur File
```
├── index.html          # Halaman utama
├── css/style.css       # Dark cyberpunk styling
├── js/
│   ├── utils.js        # Utility functions
│   ├── data.js         # Game data (items, locations, NPCs)
│   ├── game.js         # Game engine & state
│   └── ui.js           # UI rendering
└── README.md
```

## 📱 Cara Main
- Klik **PETA** untuk menjelajahi lokasi
- Klik ikon NPC/toko untuk berinteraksi
- **MISI** untuk memulai misi dan mendapatkan BTC & EXP
- **PENYIMPANAN** untuk melihat inventory & equipment
- Progress otomatis tersimpan!
