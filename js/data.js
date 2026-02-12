// ============================================
// GAME DATA - Items, Locations, NPCs, Recipes
// ============================================

const GameData = {
    // ---- ITEM TYPES ----
    ITEM_TYPES: {
        WEAPON: 'weapon',
        ARMOR: 'armor',
        MATERIAL: 'material',
        CONSUMABLE: 'consumable',
        KEY: 'key',
        BAG: 'bag',
        TECH: 'tech'
    },

    // ---- EQUIPMENT SLOTS ----
    EQUIP_SLOTS: ['head', 'body', 'weapon', 'legs', 'feet', 'accessory'],

    // ---- BASE ITEMS (templates) ----
    BASE_WEAPONS: [
        { id: 'lightsaber', name: 'Lightsaber', baseDmg: 300, baseCrit: 13, slot: 'weapon', icon: '⚔️' },
        { id: 'valkyrie_ak', name: 'Valkyrie AK', baseDmg: 450, baseCrit: 3, slot: 'weapon', icon: '🔫', tag: 'DISRUPTOR' },
        { id: 'nerf_gun', name: 'Mourning Nerf Gun', baseDmg: 300, baseCrit: 14, basePocket: 2, baseHealingMultiplier: 6, slot: 'weapon', icon: '🔫', tag: 'LETHAL' },
        { id: 'plasma_blade', name: 'Plasma Blade', baseDmg: 200, baseCrit: 8, slot: 'weapon', icon: '🗡️' },
        { id: 'cyber_katana', name: 'Cyber Katana', baseDmg: 380, baseCrit: 10, slot: 'weapon', icon: '⚔️', tag: 'LETHAL' },
        { id: 'ion_rifle', name: 'Ion Rifle', baseDmg: 520, baseCrit: 5, slot: 'weapon', icon: '🔫', tag: 'DISRUPTOR' },
    ],

    BASE_ARMORS: [
        { id: 'upper_exo', name: 'Upper Exoskeleton', baseHealth: 8500, baseArmor: 430, slot: 'body', icon: '🛡️' },
        { id: 'coffee_pants', name: 'Coffee Stained Pants Of Shielding', baseHealth: 7370, baseArmor: 410, baseShield: 615, slot: 'legs', icon: '👖', tag: 'LETHAL' },
        { id: 'tiara_health', name: 'Tiara Of Health', baseHealth: 4782, baseArmor: 213, slot: 'head', icon: '👑', tag: 'LETHAL' },
        { id: 'toque_crit', name: 'Toque Of Crit Chance', baseHealth: 3724, baseArmor: 207, baseCrit: 5, slot: 'head', icon: '🎩', tag: 'DISRUPTOR' },
        { id: 'pants_crit', name: 'Pants Of Crit Chance', baseHealth: 5014, baseArmor: 168, baseCrit: 4, slot: 'legs', icon: '👖', tag: 'DISRUPTOR' },
        { id: 'mocassins_crit', name: 'Mocassins Of Crit Chance +1', baseHealth: 1728, baseArmor: 97, baseCrit: 6, baseShield: 581, slot: 'feet', icon: '👟', tag: 'LETHAL' },
        { id: 'cyber_vest', name: 'Cyber Vest', baseHealth: 6000, baseArmor: 350, slot: 'body', icon: '🦺' },
        { id: 'neon_boots', name: 'Neon Boots', baseHealth: 2200, baseArmor: 150, slot: 'feet', icon: '👢' },
    ],

    // ---- MATERIALS ----
    MATERIALS: [
        { id: 'tech_ammo', name: 'Bagian Teknologi Amunisi', icon: '⚙️', stackable: true, maxStack: 9999 },
        { id: 'nano_bot_low', name: 'Bot Medis Nano Kualitas Rendah', icon: '🤖', stackable: true, maxStack: 9999 },
        { id: 'sel_energi', name: 'Sel Energi', icon: '🔋', stackable: true, maxStack: 9999 },
        { id: 'muatan_anti_materi', name: 'Muatan Anti Materi', icon: '☢️', stackable: true, maxStack: 9999 },
        { id: 'inti_ai', name: 'Inti AI', icon: '🧠', stackable: true, maxStack: 9999 },
        { id: 'hash_prosesor', name: 'Hash Prosesor', icon: '💾', stackable: true, maxStack: 9999 },
        { id: 'pereda_sakit', name: 'Pereda Rasa Sakit', icon: '💊', stackable: true, maxStack: 9999 },
        { id: 'senjatan_tek', name: 'Serpihan Teknologi Medis', icon: '🔬', stackable: true, maxStack: 9999 },
        { id: 'peralatan_kalibrasi', name: 'Peralatan Inti Kalibrasi', icon: '🔧', stackable: true, maxStack: 9999 },
        { id: 'protokol_breach', name: 'Protokol Breach Shard', icon: '💿', stackable: true, maxStack: 9999 },
        { id: 'dadu_beruntung', name: 'Dadu Beruntung', icon: '🎲', stackable: true, maxStack: 9999 },
        { id: 'kepingan_teknologi', name: 'Kepingan Teknologi', icon: '🔩', stackable: true, maxStack: 9999 },
        { id: 'bahan_armor_atas', name: 'Bahan Armor Bagian Atas', icon: '🧱', stackable: true, maxStack: 999 },
        { id: 'bahan_senjata_utama', name: 'Bahan Senjata Utama', icon: '⚒️', stackable: true, maxStack: 999 },
        { id: 'bahan_senjata_spesial', name: 'Bahan Senjata Spesial', icon: '⚒️', stackable: true, maxStack: 999 },
        { id: 'bahan_senjata_penghancur', name: 'Bahan Senjata Penghancur', icon: '⚒️', stackable: true, maxStack: 999 },
    ],

    // ---- KEYS (Kunci Rahasia) ----
    KEYS: [
        { id: 'kunci_flori_1', name: 'Kepingan Kunci Flori 1', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_flori_2', name: 'Kepingan Kunci Flori 2', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_flori_3', name: 'Kepingan Kunci Flori 3', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_hollto_1', name: 'Kepingan Kunci Hollto 1', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_hollto_2', name: 'Kepingan Kunci Hollto 2', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_hollto_3', name: 'Kepingan Kunci Hollto 3', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_torida_1', name: 'Kepingan Kunci Torida 1', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_torida_2', name: 'Kepingan Kunci Torida 2', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_torida_3', name: 'Kepingan Kunci Torida 3', icon: '🔑', stackable: true, maxStack: 99 },
        { id: 'kunci_flori', name: 'Kunci Rahasia Flori', icon: '🗝️', stackable: false },
        { id: 'kunci_hollto', name: 'Kunci Rahasia Hollto', icon: '🗝️', stackable: false },
        { id: 'kunci_torida', name: 'Kunci Rahasia Torida', icon: '🗝️', stackable: false },
    ],

    // ---- BAGS ----
    BAGS: [
        { id: 'kantong_tua', name: 'Kantong Tua', icon: '👝', capacity: 20, tradeCooldown: 300 },
        { id: 'fanny_pack', name: 'Fanny Pack', icon: '👜', capacity: 40, tradeCooldown: 600 },
        { id: 'ransel_petualang', name: 'Ransel Petualang', icon: '🎒', capacity: 77, tradeCooldown: 1800 },
    ],

    // ---- CONSUMABLES ----
    CONSUMABLES: [
        { id: 'pereda_rasa_sakit', name: 'Pereda Rasa Sakit', price: 400, icon: '💊', effect: 'heal', value: 500 },
        { id: 'semprotan_pereda', name: 'Semprotan Pereda Rasa Sakit', price: 500, icon: '💉', effect: 'heal', value: 800 },
        { id: 'bot_perbaikan_low', name: 'Bot Perbaikan Nano Kualitas Rendah', price: 1000, icon: '🤖', effect: 'heal', value: 1500 },
        { id: 'drone_perbaikan_low', name: 'Drone Perbaikan Kualitas Rendah', price: 1200, icon: '🛸', effect: 'heal', value: 2000 },
        { id: 'bot_medis_nano_low', name: 'Bot Medis Nano Kualitas Rendah', price: 5000, icon: '🤖', effect: 'heal', value: 5000 },
        { id: 'drone_nano_medis_low', name: 'Drone Nano Medis Kualitas Rendah', price: 5400, icon: '🛸', effect: 'heal', value: 5500 },
        { id: 'bot_nano_medis', name: 'Bot Nano Medis', price: 10000, icon: '🤖', effect: 'heal', value: 10000 },
        { id: 'drone_nano_medis', name: 'Drone Nano Medis', price: 11000, icon: '🛸', effect: 'heal', value: 11000 },
    ],

    // ---- TECH ITEMS (Bursa Arasaka - Unit currency) ----
    TECH_ITEMS: [
        { id: 'suplai_bundel', name: 'Suplai Bundel Skip', priceUnit: 1200, icon: '📦', desc: 'Tersedia sekali sehari' },
        { id: 'pemancar_synaptic', name: 'Pemancar Akselerasi Synaptic Langka', priceUnit: 64, icon: '📡' },
        { id: 'pemancar_exploit', name: 'Pemancar Exploit Transaksi', priceUnit: 128, icon: '📡' },
        { id: 'pemancar_korteks', name: 'Pemancar Optimasi Korteks Frontal', priceUnit: 256, icon: '📡' },
        { id: 'rng_interferer', name: 'RNG Interferer', priceUnit: 2048, icon: '🔴', rare: true },
        { id: 'token_tukar', name: 'Token Akses Tukar Peroletan', priceUnit: 2048, icon: '🔵' },
        { id: 'pemancar_obrolan_bajak', name: 'Pemancar Eksploitasi Obrolan (Bajak Laut)', priceUnit: 512, icon: '📡' },
        { id: 'pemancar_obrolan_1337', name: 'Pemancar Eksploitasi Obrolan (1337)', priceUnit: 512, icon: '📡' },
    ],

    // ---- LOCATIONS ----
    LOCATIONS: {
        pusat_kota: {
            id: 'pusat_kota',
            name: 'Pusat Kota Shangri-La',
            desc: 'Salah satu kota paling sibuk di benua ini. Di sini kamu bisa menemukan segala macam orang dan seluruh dunia.',
            tag: 'Pusat Sentral',
            interactables: [
                { id: 'kantor_bursa', name: 'Kantor Bursa Arasaka', icon: '🏢' },
                { id: 'kosmetik', name: 'Kosmetik Cyberwear', icon: '💄' },
                { id: 'printer_3d', name: 'Printer 3D Molekuler', icon: '🖨️' },
                { id: 'toko_senjata', name: 'Toko Senjata', icon: '🔫' },
                { id: 'toko_trinoky', name: 'Toko Trinoky', icon: '➕' },
                { id: 'terminal', name: 'Terminal', icon: '🖥️' },
                { id: 'bank_arasaka', name: 'Bank Arasaka', icon: '🏦' },
                { id: 'pos_perdagangan', name: 'Pos Perdagangan Lee', icon: '🏪' },
                { id: 'stasiun_kalibrasi', name: 'Stasiun Kalibrasi', icon: '⚙️' },
            ],
            travel: [
                { id: 'stasiun_kereta', name: 'Pergi ke Stasiun Pusat Kereta Hyper', desc: 'Dengan hyperloop, kamu bisa menempuh benua dengan kecepatan supersonik tanpa repot.', icon: '🚄', btnText: 'Petualangan' },
                { id: 'area_komersial', name: 'Pergi ke Area Komersial Shangri-La', desc: 'Berbagai toko dan bisnis berlokasi di sini. Tempat sempurna untuk mengasah serta menyempurnakan keahlianmu.', icon: '🏬', btnText: 'Pusat Pekerjaan' },
                { id: 'jalan_pasar', name: 'Pergi ke Jalan Pasar Shangri-La', desc: 'Jalan pasar terkenal di Shangri-La. Banyak kios pasar mengisi jalan ini.', icon: '🏪', btnText: 'Pasar Pemain' },
                { id: 'markas_geng', name: 'Pergi ke Markas Geng', desc: 'Markas utama bagi kamu dan anggota gengmu untuk merencanakan serta mengeksekusi operasi berikutnya.', icon: '🏴', btnText: 'Geng', requirement: 'gang' },
                { id: 'apartemen', name: 'Pergi ke Apartemenmu', desc: 'Apartemen nyaman di kota. Hewan peliharaanmu menunggu kamu pulang.', icon: '🏠', btnText: 'Apartemen', requirement: 'level_50' },
                { id: 'area_pantai', name: 'Pergi ke Area Pantai', desc: 'Pantai indah beberapa kilometer dari pusat kota. Tempat sempurna untuk beristirahat dan menikmati hembusan angin laut.', icon: '🏖️', btnText: 'Pantai' },
            ]
        },
        jalan_pasar: {
            id: 'jalan_pasar',
            name: 'Jalan Pasar Shangri-La',
            desc: 'Jalan pasar terkenal di Shangri-La. Banyak kios pasar mengisi jalan ini.',
            tag: 'Pasar Pemain',
            parent: 'pusat_kota',
            interactables: [
                { id: 'pasar_gelap', name: 'Pasar Gelap', icon: '🕶️' },
                { id: 'toko_sudut_yen', name: 'Toko Sudut Yen', icon: '✨' },
                { id: 'santai_mesin', name: 'Santai Mesin Paws', icon: '🐾' },
                { id: 'pub_jalanan', name: 'Pub Jalanan', icon: '🍺', highlight: true },
            ],
            actions: [
                { id: 'pasar_pemain', name: 'Kunjungi Pasar Pemain', desc: 'Anda dapat membeli barang dari pemain lain di sini', icon: '🛒' },
                { id: 'kios_ku', name: 'Kios Ku', desc: 'Anda dapat mengelola barang-barang Anda di pasar pemain sini', icon: '📋' },
            ],
            tindakan: [
                { id: 'sukarelawan', name: 'Jadwal Jaga Sukarelawan Panti Hewan', desc: 'Jadi relawan di tempat penampungan hewan lokal untuk membantu merawat hewan-hewan tersebut.', icon: '🐕' },
            ]
        },
        area_komersial: {
            id: 'area_komersial',
            name: 'Area Komersial Shangri-La',
            desc: 'Berbagai toko dan bisnis berlokasi di sini. Tempat sempurna untuk mengasah serta menyempurnakan keahlianmu.',
            tag: 'Pusat Pekerjaan',
            parent: 'pusat_kota',
            interactables: [],
            actions: [
                { id: 'kerja_freelance', name: 'Kerja Freelance', desc: 'Selesaikan pekerjaan untuk mendapatkan BTC dan EXP.', icon: '💻' },
            ],
            tindakan: [
                { id: 'bekerja_percetakan', name: 'BEKERJA DI PABRIK PERCETAKAN', desc: 'Meningkatkan Pangkat Percetakanmu tanpa mengorbankan kepingan teknologi, dapat membantu meningkatkan pangkat percetakan kamu.', icon: '⚙️', btnText: 'Latihan Cetak' },
                { id: 'klinik_tubuh', name: 'KLINIK PENGUBAHAN TUBUH', desc: 'Mengunduh data yang berguna dari Klinik Modifikasi Tubuh Lokal untuk membuat Bot Medis and Drone Medis dengan kualitas yang lebih tinggi.', icon: '🏥', btnText: 'Pelatihan Medis' },
                { id: 'peningkatan_amunisi', name: 'PENINGKATAN AMUNISI', desc: 'Mengotak-atik amunisi, untuk mencari cara yang lebih efektif untuk membuat amunisi.', icon: '🔫', btnText: 'Latihan Amunisi' },
                { id: 'rekayasa_balik', name: 'KEPINGAN REKAYASA BALIK', desc: 'Rekayasa balik kepingan teknologimu untuk meningkatkan Level print, kamu perlu mengorbankan beberapa Kepingan Teknologimu.', icon: '🔬', btnText: 'Latihan Cetak', reqItem: 'kepingan_teknologi', reqQty: 1 },
                { id: 'tambang_kripto', name: 'COBA-COBA TAMBANG KRIPTO', desc: 'Memulai menambang kripto akan membuatmu mendapatkan Bitcoin, namun karena penggunaan Prosesor Hash yang intensif, Quantum Processing Unit atau GPU, akan sering terbakar.', icon: '⛏️', btnText: 'Penambangan', reqItem: 'hash_prosesor', reqQty: 1 },
            ]
        },
        area_pantai: {
            id: 'area_pantai',
            name: 'Area Pantai',
            desc: 'Pantai indah beberapa kilometer dari pusat kota. Tempat sempurna untuk beristirahat.',
            tag: 'Pantai',
            parent: 'pusat_kota',
            interactables: [],
            actions: [
                { id: 'memancing', name: 'Memancing', desc: 'Coba peruntunganmu memancing di laut. Bisa mendapatkan item langka!', icon: '🎣' },
            ]
        },
        apartemen: {
            id: 'apartemen',
            name: 'Apartemenmu',
            desc: 'Apartemen nyaman di kota. Hewan peliharaanmu menunggu kamu pulang.',
            tag: 'Apartemen',
            parent: 'pusat_kota',
            interactables: [],
            actions: [
                { id: 'istirahat', name: 'Istirahat', desc: 'Pulihkan HP-mu secara penuh. Cooldown 30 menit.', icon: '🛏️' },
            ]
        },
        stasiun_kereta: {
            id: 'stasiun_kereta',
            name: 'Stasiun Pusat Kereta Hyper',
            desc: 'Dengan hyperloop, kamu bisa menempuh benua dengan kecepatan supersonik tanpa repot.',
            tag: 'Petualangan',
            parent: 'pusat_kota',
            interactables: [],
            hideFilter: true,
            travel: [
                { id: 'stasiun_flori', name: 'PERGI KE STASIUN FLORI', levelRange: 'Level 1 sampai 10', icon: '🚄', levelReq: 1, maxLevel: 10 },
                { id: 'stasiun_hollto', name: 'PERGI KE STASIUN HOLLTO', levelRange: 'Level 11 sampai 20', icon: '🚄', levelReq: 11, maxLevel: 20 },
                { id: 'stasiun_torida', name: 'PERGI KE STASIUN TORIDA', levelRange: 'Level 21 sampai 30', icon: '🚄', levelReq: 21, maxLevel: 30 },
                { id: 'stasiun_phille', name: 'PERGI KE STASIUN PHILLE', levelRange: 'Level 31 sampai 40', icon: '🚄', levelReq: 31, maxLevel: 40 },
                { id: 'stasiun_hashinomi', name: 'PERGI KE STASIUN HASHINOMI', levelRange: 'Level 41 sampai 50', icon: '🚄', levelReq: 41, maxLevel: 50 },
                { id: 'stasiun_akado', name: 'PERGI KE STASIUN AKADO', levelRange: 'Level 61 sampai 70', icon: '🚄', levelReq: 61, maxLevel: 70 },
            ],
            travelBack: [
                { id: 'pusat_kota', name: 'KEMBALI KE PUSAT KOTA SHANGRI-LA', desc: 'Salah satu kota paling sibuk di benua ini.', icon: '🏙️', btnText: 'Pusat Sentral' },
            ]
        },
        stasiun_flori: {
            id: 'stasiun_flori', name: 'Stasiun Flori', desc: 'Stasiun pertama untuk petualang pemula.', tag: 'Lv 1-10', parent: 'stasiun_kereta', interactables: [],
            travel: [
                { id: 'flori_outskirts', name: 'PERGI KE FLORI OUTSKIRTS', levelRange: 'Lv. 1 - 4', icon: '🚶', levelReq: 1 },
                { id: 'flori_downtown', name: 'PERGI KE FLORI DOWNTOWN', levelRange: 'Lv. 4 - 7', icon: '🚶', levelReq: 4 },
                { id: 'flori_temple', name: 'PERGI KE MAIN FLORI TEMPLE', levelRange: 'Lv. 7 - 10', icon: '🚶', levelReq: 7 },
            ],
            travelBack: [
                { id: 'stasiun_kereta', name: 'KEMBALI KE STASIUN PUSAT KERETA HYPER', desc: 'Dengan hyperloop, kamu bisa menempuh benua dengan kecepatan supersonik tanpa repot.', icon: '🚄', btnText: 'Petualangan' },
                { id: 'pusat_kota', name: 'KEMBALI KE PUSAT KOTA SHANGRI-LA', desc: 'Salah satu kota paling sibuk di benua ini.', icon: '🏙️', btnText: 'Pusat Sentral' },
            ]
        },
        stasiun_hollto: {
            id: 'stasiun_hollto', name: 'Stasiun Hollto', desc: 'Stasiun dengan suasana industrial.', tag: 'Lv 11-20', parent: 'stasiun_kereta', interactables: [],
            travel: [
                { id: 'hollto_district', name: 'PERGI KE HOLLTO DISTRICT', levelRange: 'Lv. 11 - 14', icon: '🚶', levelReq: 11 },
                { id: 'hollto_market', name: 'PERGI KE HOLLTO MARKET', levelRange: 'Lv. 14 - 17', icon: '🚶', levelReq: 14 },
                { id: 'hollto_temple', name: 'PERGI KE MAIN HOLLTO TEMPLE', levelRange: 'Lv. 17 - 20', icon: '🚶', levelReq: 17 },
            ],
            travelBack: [
                { id: 'stasiun_kereta', name: 'KEMBALI KE STASIUN PUSAT KERETA HYPER', desc: 'Dengan hyperloop.', icon: '🚄', btnText: 'Petualangan' },
                { id: 'pusat_kota', name: 'KEMBALI KE PUSAT KOTA SHANGRI-LA', desc: 'Kota paling sibuk.', icon: '🏙️', btnText: 'Pusat Sentral' },
            ]
        },
        stasiun_torida: {
            id: 'stasiun_torida', name: 'Stasiun Torida', desc: 'Stasiun di wilayah bersalju.', tag: 'Lv 21-30', parent: 'stasiun_kereta', interactables: [],
            travel: [
                { id: 'torida_village', name: 'PERGI KE TORIDA VILLAGE', levelRange: 'Lv. 21 - 24', icon: '🚶', levelReq: 21 },
                { id: 'torida_fortress', name: 'PERGI KE TORIDA FORTRESS', levelRange: 'Lv. 24 - 27', icon: '🚶', levelReq: 24 },
                { id: 'torida_temple', name: 'PERGI KE MAIN TORIDA TEMPLE', levelRange: 'Lv. 27 - 30', icon: '🚶', levelReq: 27 },
            ],
            travelBack: [
                { id: 'stasiun_kereta', name: 'KEMBALI KE STASIUN PUSAT KERETA HYPER', desc: 'Hyperloop.', icon: '🚄', btnText: 'Petualangan' },
                { id: 'pusat_kota', name: 'KEMBALI KE PUSAT KOTA SHANGRI-LA', desc: 'Kota sibuk.', icon: '🏙️', btnText: 'Pusat Sentral' },
            ]
        },
        stasiun_phille: {
            id: 'stasiun_phille', name: 'Stasiun Phille', desc: 'Stasiun megah di kota metropolis.', tag: 'Lv 31-40', parent: 'stasiun_kereta', interactables: [],
            travel: [
                { id: 'phille_slums', name: 'PERGI KE PHILLE SLUMS', levelRange: 'Lv. 31 - 34', icon: '🚶', levelReq: 31 },
                { id: 'phille_center', name: 'PERGI KE PHILLE CENTER', levelRange: 'Lv. 34 - 37', icon: '🚶', levelReq: 34 },
                { id: 'phille_temple', name: 'PERGI KE MAIN PHILLE TEMPLE', levelRange: 'Lv. 37 - 40', icon: '🚶', levelReq: 37 },
            ],
            travelBack: [
                { id: 'stasiun_kereta', name: 'KEMBALI KE STASIUN PUSAT KERETA HYPER', desc: 'Hyperloop.', icon: '🚄', btnText: 'Petualangan' },
                { id: 'pusat_kota', name: 'KEMBALI KE PUSAT KOTA SHANGRI-LA', desc: 'Kota sibuk.', icon: '🏙️', btnText: 'Pusat Sentral' },
            ]
        },
        stasiun_hashinomi: {
            id: 'stasiun_hashinomi', name: 'Stasiun Hashinomi', desc: 'Stasiun teknologi tinggi.', tag: 'Lv 41-50', parent: 'stasiun_kereta', interactables: [],
            travel: [
                { id: 'hashinomi_port', name: 'PERGI KE HASHINOMI PORT', levelRange: 'Lv. 41 - 44', icon: '🚶', levelReq: 41 },
                { id: 'hashinomi_lab', name: 'PERGI KE HASHINOMI LAB', levelRange: 'Lv. 44 - 47', icon: '🚶', levelReq: 44 },
                { id: 'hashinomi_temple', name: 'PERGI KE MAIN HASHINOMI TEMPLE', levelRange: 'Lv. 47 - 50', icon: '🚶', levelReq: 47 },
            ],
            travelBack: [
                { id: 'stasiun_kereta', name: 'KEMBALI KE STASIUN PUSAT KERETA HYPER', desc: 'Hyperloop.', icon: '🚄', btnText: 'Petualangan' },
                { id: 'pusat_kota', name: 'KEMBALI KE PUSAT KOTA SHANGRI-LA', desc: 'Kota sibuk.', icon: '🏙️', btnText: 'Pusat Sentral' },
            ]
        },
        stasiun_akado: {
            id: 'stasiun_akado', name: 'Stasiun Akado', desc: 'Stasiun di area perbatasan yang berbahaya.', tag: 'Lv 61-70', parent: 'stasiun_kereta', interactables: [],
            travel: [
                { id: 'akado_marina', name: 'PERGI KE SNOWDRIFT AKADO MARINA', levelRange: 'Lv. 61 - 64', icon: '🚶', levelReq: 61 },
                { id: 'akado_gov', name: 'PERGI KE PECULIAR AKADO GOVERNMENT AGENCY', levelRange: 'Lv. 64 - 67', icon: '🚶', levelReq: 64 },
                { id: 'akado_temple', name: 'PERGI KE MAIN AKADO TEMPLE', levelRange: 'Lv. 67 - 70', icon: '🚶', levelReq: 67 },
            ],
            travelBack: [
                { id: 'stasiun_kereta', name: 'KEMBALI KE STASIUN PUSAT KERETA HYPER', desc: 'Hyperloop.', icon: '🚄', btnText: 'Petualangan' },
                { id: 'pusat_kota', name: 'KEMBALI KE PUSAT KOTA SHANGRI-LA', desc: 'Kota sibuk.', icon: '🏙️', btnText: 'Pusat Sentral' },
            ]
        },
        akado_temple: {
            id: 'akado_temple', name: 'Main Akado Temple', desc: 'Kuil kuno dengan teknologi canggih.', tag: 'Lv 67-70', parent: 'stasiun_akado',
            interactables: [],
            combatZones: [
                { id: 'musuh_akado', name: 'MUSUH TERDEKAT', desc: 'Pemindaian untuk musuh terdekat di jalan, musuh di luar rubahnya lebih lemah dan lebih mudah dikalahkan. Namun mereka juga memberikan lebih sedikit exp', icon: '⚔️', type: 'enemies' },
                { id: 'dungeon_akado', name: 'DUNGEON', desc: 'Di dungeon, Kamu tidak akan sembuh setelah setiap pertarungan, dan musuh menjadi lebih kuat, tetapi ada lebih banyak exp dan jarahan', icon: '🏰', type: 'dungeon' },
            ],
            tindakan: [
                { id: 'bot_farm', name: 'TERJUNKAN BOT UNTUK FARM', desc: 'Mengirim AI ke dungeon untukmu. Ini akan menghabiskan satu AI Core, biasanya hanya cukup untuk satu perjalanan saja.', icon: '🤖', reqItem: 'inti_ai', reqQty: 1, btnText: 'AFK Peternakan EXP' },
                { id: 'memulung_akado', name: 'MEMULUNG DI MAIN AKADO TEMPLE', desc: 'Telusuri area Main Akado Temple dan kumpulkan barang-barang berguna. Siapa tahu, kamu beruntung!', icon: '🔍', reqSkill: 'searchLevel', reqSkillLevel: 67, btnText: 'Kumpulkan Sumber Daya AFK' },
            ],
            travel: [
                { id: 'stasiun_akado', name: 'KEMBALI KE STASIUN AKADO', levelRange: 'Level 61 sampai 70', icon: '🚄', levelReq: 61 },
            ]
        },
    },

    // ---- ENEMIES ----
    ENEMIES: {
        akado_temple: [
            { name: 'Black Market Seller', level: 67, type: 'Angry', color: '#c8b44a' },
            { name: 'Clown Gang Informant', level: 67, type: 'Angry', color: '#c8b44a' },
            { name: 'Insidious Nun', level: 67, type: null, color: '#e8e8f0' },
            { name: 'Addict', level: 68, type: 'Angry', color: '#c8b44a' },
            { name: 'Gunslinger', level: 68, type: 'Angry', color: '#c8b44a' },
            { name: 'Evil Ringmaster', level: 68, type: null, color: '#e8e8f0' },
            { name: 'Oathbound Servant', level: 68, type: 'Mad', color: '#c8b44a' },
            { name: 'Violent Spirit', level: 68, type: 'Mad', color: '#c8b44a' },
            { name: 'Godless Sect Member', level: 68, type: 'Shielded', color: '#22c55e' },
            { name: 'Underworld Spy', level: 68, type: null, color: '#e8e8f0' },
            { name: 'Evil Bit Jockey', level: 69, type: 'Agile', color: '#00e5ff' },
            { name: 'Frenzied Nurse', level: 69, type: 'Agile', color: '#00e5ff' },
            { name: 'GL1tch3d H0und', level: 69, type: null, color: '#e8e8f0' },
            { name: 'Underworld Enforcer', level: 69, type: 'Mad', color: '#c8b44a' },
            { name: "Warmaster's Tactician", level: 69, type: 'Mad', color: '#c8b44a' },
            { name: 'Nano Guardian', level: 69, type: 'Crit', color: '#ef4444' },
            { name: 'Common Criminal', level: 69, type: 'Shielded', color: '#22c55e' },
            { name: 'Evil Stunt Double', level: 70, type: null, color: '#e8e8f0' },
            { name: 'Godless Promoter', level: 70, type: null, color: '#e8e8f0' },
            { name: 'Infected Mutant', level: 70, type: 'Shielded', color: '#22c55e' },
        ]
    },

    // ---- DUNGEONS ----
    DUNGEONS: {
        akado_temple: [
            { id: 'jelajahi_akado', name: 'JELAJAHI MAIN AKADO TEMPLE', tier: 'NORMAL', recLevel: 70, expMultiplier: 2.0, lootDrop: 'Jarahan Kepingan Kunci Akado 3', levelReq: 57, color: '#e8e8f0' },
            { id: 'serang_akado', name: 'SERANG MAIN AKADO TEMPLE', tier: 'CHALLENGE', recLevel: '70+ dengan co-op', expMultiplier: 2.0, lootDrop: 'drop jarahan Kepingan Kunci Akado 3', levelReq: 57, extra: 'Mode challenge dungeon, Ekstra loot dan exp.', color: '#c8b44a' },
            { id: 'invasi_akado', name: 'INVASI MAIN AKADO TEMPLE', tier: 'GANG', recLevel: '70+ dengan co-op', expMultiplier: 2.0, lootDrop: 'Boss akan menjatuhkan equipment Langka+', levelReq: 57, extra: 'Mode Geng Dungeon, Ekstra Loot dan exp.', reqItem: 'pemancar_invasi', reqQty: 1, reqGang: true, color: '#ef4444' },
        ]
    },

    // ---- TRAINING (Area Komersial) ----
    TRAINING: [
        { id: 'bekerja_percetakan', name: 'BEKERJA DI PABRIK PERCETAKAN', desc: 'Meningkatkan Pangkat Percetakanmu tanpa mengorbankan kepingan teknologi, dapat membantu meningkatkan pangkat percetakan kamu.', icon: '⚙️', btnText: 'Latihan Cetak', reward: 'craftExp', rewardAmount: [50, 200], cooldown: 300 },
        { id: 'klinik_tubuh', name: 'KLINIK PENGUBAHAN TUBUH', desc: 'Mengunduh data yang berguna dari Klinik Modifikasi Tubuh Lokal untuk membuat Bot Medis and Drone Medis dengan kualitas yang lebih tinggi.', icon: '🏥', btnText: 'Pelatihan Medis', reward: 'medExp', rewardAmount: [50, 200], cooldown: 300 },
        { id: 'peningkatan_amunisi', name: 'PENINGKATAN AMUNISI', desc: 'Mengotak-atik amunisi, untuk mencari cara yang lebih efektif untuk membuat amunisi.', icon: '🔫', btnText: 'Latihan Amunisi', reward: 'ammoExp', rewardAmount: [50, 200], cooldown: 300 },
        { id: 'rekayasa_balik', name: 'KEPINGAN REKAYASA BALIK', desc: 'Rekayasa balik kepingan teknologimu untuk meningkatkan Level print, kamu perlu mengorbankan beberapa Kepingan Teknologimu.', icon: '🔬', btnText: 'Latihan Cetak', reqItem: 'kepingan_teknologi', reqQty: 1, reward: 'craftExp', rewardAmount: [100, 400], cooldown: 180 },
        { id: 'tambang_kripto', name: 'COBA-COBA TAMBANG KRIPTO', desc: 'Memulai menambang kripto akan membuatmu mendapatkan Bitcoin, namun karena penggunaan Prosesor Hash yang intensif, Quantum Processing Unit atau GPU, akan sering terbakar.', icon: '⛏️', btnText: 'Penambangan', reqItem: 'hash_prosesor', reqQty: 1, reward: 'btc', rewardAmount: [500, 5000], cooldown: 600 },
    ],

    // ---- CALIBRATION ----
    CALIBRATION: {
        npc: { id: 'kamila', name: 'Kamila', title: 'Stasiun Kalibrasi', dialog: 'Masukkan inti kalibrasi ke dalam mesin, dan saya akan membantu mengkalibrasi peralatanmu.', icon: '👩‍🔧' },
        funds: [
            { id: 'kalibrasi_am', name: 'DANA KALIBRASI 7:00:00 AM', time: 7, period: 'AM', maxProgress: 100, rate: 10 },
            { id: 'kalibrasi_pm', name: 'DANA KALIBRASI 7:00:00 PM', time: 19, period: 'PM', maxProgress: 100, rate: 10 },
        ]
    },

    // ---- NPCs ----
    NPCS: {
        lee: {
            id: 'lee',
            name: 'Lee',
            title: 'Pos Perdagangan Lee',
            dialog: 'Hei nak, saya Lee. Kamu tahu, Kamu tidak perlu membawa semua yang Kamu miliki di sakumu.',
            icon: '🧔',
            location: 'pos_perdagangan',
            shopType: 'trade'
        },
        victor: {
            id: 'victor',
            name: 'Victor',
            title: 'Toko Trinoky',
            dialog: 'Hei nak.. Ayo periksa barang barangku.',
            icon: '🧑‍⚕️',
            location: 'toko_trinoky',
            shopType: 'buy'
        },
        lexi: {
            id: 'lexi',
            name: 'Lexi',
            title: 'Bank Arasaka',
            dialog: 'Selamat datang. Apa yang bisa saya simpan untukmu?',
            icon: '👩‍💼',
            location: 'bank_arasaka',
            shopType: 'bank'
        },
        violet: {
            id: 'violet',
            name: 'Violet',
            title: 'Kantor Bursa Arasaka',
            dialog: 'Apakah kamu ingin membeli Unit.. atau menggunakan Unit yang itu punya?',
            icon: '👩‍💻',
            location: 'kantor_bursa',
            shopType: 'exchange'
        },
        liam: {
            id: 'liam',
            name: 'Liam',
            title: 'Terminal',
            dialog: 'Saya akan membantumu untuk maju ke area berikutnya!',
            icon: '🧑‍💻',
            location: 'terminal',
            shopType: 'terminal'
        },
        kamila: {
            id: 'kamila',
            name: 'Kamila',
            title: 'Stasiun Kalibrasi',
            dialog: 'Masukkan inti kalibrasi ke dalam mesin, dan saya akan membantu mengkalibrasi peralatanmu.',
            icon: '👩‍🔧',
            location: 'stasiun_kalibrasi',
            shopType: 'calibration'
        }
    },

    // ---- CRAFTING RECIPES ----
    CRAFTING_RECIPES: [
        {
            id: 'armor_atas',
            name: 'Armor Bagian Atas',
            icon: '🛡️',
            requirements: [
                { itemId: 'bahan_armor_atas', qty: 1 }
            ],
            costBtc: 2125,
            rewards: { type: 'armor', slot: 'body' },
            craftExp: 2625,
            printCount: 1
        },
        {
            id: 'senjata_utama',
            name: 'Senjata Utama',
            icon: '⚔️',
            requirements: [
                { itemId: 'bahan_senjata_utama', qty: 1 }
            ],
            costBtc: 6365,
            rewards: { type: 'weapon', slot: 'weapon' },
            craftExp: 2625,
            printCount: 25
        },
        {
            id: 'senjata_spesial',
            name: 'Senjata Spesial',
            icon: '⚔️',
            requirements: [
                { itemId: 'bahan_senjata_spesial', qty: 1 }
            ],
            costBtc: 6365,
            rewards: { type: 'weapon', slot: 'weapon' },
            craftExp: 2625,
            printCount: 3,
            highlight: true
        },
        {
            id: 'senjata_penghancur',
            name: 'Senjata Penghancur',
            icon: '⚔️',
            requirements: [
                { itemId: 'bahan_senjata_penghancur', qty: 1 }
            ],
            costBtc: 6365,
            rewards: { type: 'weapon', slot: 'weapon' },
            craftExp: 2625,
            printCount: 1,
            highlight: true
        }
    ],

    // ---- BAG RECIPES (Pos Perdagangan Lee) ----
    BAG_RECIPES: [
        {
            id: 'craft_kantong',
            name: 'Kantong Tua',
            requirements: [{ itemId: 'kepingan_teknologi', qty: 100 }],
            costBtc: 500,
            result: 'kantong_tua',
            cooldown: 300,
            icon: '👝'
        },
        {
            id: 'craft_fanny',
            name: 'Fanny Pack',
            requirements: [{ itemId: 'kantong_tua', qty: 10 }],
            costBtc: 4000,
            result: 'fanny_pack',
            cooldown: 600,
            icon: '👜'
        },
        {
            id: 'craft_ransel',
            name: 'Ransel Petualang',
            requirements: [{ itemId: 'fanny_pack', qty: 15 }],
            costBtc: 15000,
            result: 'ransel_petualang',
            cooldown: 1800,
            icon: '🎒'
        }
    ],

    // ---- TERMINAL KUNCI RAHASIA ----
    KUNCI_RAHASIA: [
        {
            id: 'flori',
            name: 'Flori Kunci Rahasia',
            levelRange: 'Lv 1 - 10',
            requirements: [
                { itemId: 'kunci_flori_1', qty: 1 },
                { itemId: 'kunci_flori_2', qty: 1 },
                { itemId: 'kunci_flori_3', qty: 1 },
            ],
            reward: 'kunci_flori',
            rewardDesc: 'Kunci Rahasia Flori',
            attackNote: 'Anda tidak dapat serang-paksa ini',
            consumeNote: 'Hilang 1 Kepingan Kunci Flori',
            color: '#c8b44a'
        },
        {
            id: 'hollto',
            name: 'Hollto Kunci Rahasia',
            levelRange: 'Lv 11 - 20',
            requirements: [
                { itemId: 'kunci_hollto_1', qty: 1 },
                { itemId: 'kunci_hollto_2', qty: 1 },
                { itemId: 'kunci_hollto_3', qty: 1 },
            ],
            reward: 'kunci_hollto',
            rewardDesc: 'Kunci Rahasia Hollto',
            attackNote: 'Anda tidak dapat serang-paksa ini',
            consumeNote: 'Hilang 1 Kepingan Kunci Hollto',
            color: '#c8b44a'
        },
        {
            id: 'torida',
            name: 'Torida Kunci Rahasia',
            levelRange: 'Lv 21 - 30',
            requirements: [
                { itemId: 'kunci_torida_1', qty: 1 },
                { itemId: 'kunci_torida_2', qty: 1 },
                { itemId: 'kunci_torida_3', qty: 1 },
            ],
            reward: 'kunci_torida',
            rewardDesc: 'Kunci Rahasia Torida',
            attackNote: 'Anda tidak dapat serang-paksa ini',
            consumeNote: 'Hilang 1 Kepingan Kunci Torida',
            color: '#c8b44a'
        }
    ],

    // ---- MISSIONS ----
    MISSIONS: [
        {
            id: 'patrol_dasar',
            name: 'Patrol Dasar',
            desc: 'Patroli area sekitar untuk mengamankan perimeter.',
            duration: 300,
            levelReq: 1,
            rewardType: 'mencetak',
            skillExp: [50, 200],
            rewards: {
                btc: [100, 500],
                exp: [50, 200],
                items: [
                    { itemId: 'tech_ammo', chance: 50, qty: [1, 5] },
                    { itemId: 'kepingan_teknologi', chance: 30, qty: [1, 3] },
                ]
            },
            multiplier: 12
        },
        {
            id: 'hacknet_run',
            name: 'Hacknet Run',
            desc: 'Jalankan program hacking untuk mendapatkan data berharga.',
            duration: 600,
            levelReq: 5,
            rewards: {
                btc: [300, 1000],
                exp: [100, 400],
                items: [
                    { itemId: 'protokol_breach', chance: 40, qty: [1, 3] },
                    { itemId: 'hash_prosesor', chance: 30, qty: [1, 2] },
                    { itemId: 'inti_ai', chance: 10, qty: [1, 1] },
                ]
            },
            multiplier: 12,
            rewardType: 'amunisi',
            skillExp: [200, 800]
        },
        {
            id: 'cyber_heist',
            name: 'Cyber Heist',
            desc: 'Misi berisiko tinggi. Infiltrasi dan curi data korporasi.',
            duration: 1440,
            levelReq: 15,
            rewards: {
                btc: [1000, 5000],
                exp: [500, 1500],
                items: [
                    { itemId: 'muatan_anti_materi', chance: 30, qty: [1, 3] },
                    { itemId: 'bahan_senjata_utama', chance: 10, qty: [1, 1] },
                    { itemId: 'bahan_armor_atas', chance: 10, qty: [1, 1] },
                    { itemId: 'dadu_beruntung', chance: 5, qty: [1, 1] },
                ]
            },
            multiplier: 12,
            rewardType: 'medis',
            skillExp: [500, 2000]
        },
        {
            id: 'scavenge_run',
            name: 'Scavenge Run',
            desc: 'Telusuri reruntuhan kota untuk mencari barang berharga.',
            duration: 180,
            levelReq: 1,
            rewards: {
                btc: [50, 200],
                exp: [30, 100],
                items: [
                    { itemId: 'kepingan_teknologi', chance: 60, qty: [2, 8] },
                    { itemId: 'tech_ammo', chance: 40, qty: [1, 4] },
                    { itemId: 'pereda_sakit', chance: 20, qty: [1, 2] },
                ]
            },
            multiplier: 12,
            rewardType: 'mencetak',
            skillExp: [100, 400]
        }
    ],

    // ---- BUFF TAGS (shown on mission detail) ----
    BUFF_TAGS: [
        { id: 'peningkatan_cortex', name: 'PENINGKATAN CORTEX FRONTAL', buffType: 'time_reduction' },
        { id: 'akselerasi_sinaptik', name: 'AKSELERASI SINAPTIK', buffType: 'time_reduction', duration: '5 MENIT' },
        { id: 'akselerasi_langka', name: 'AKSELERASI SINAPTIK - LANGKA', buffType: 'buff_exp', duration: '5 MENIT' },
    ],

    // ---- EXP TABLE ----
    getExpForLevel(level) {
        return Math.floor(1000 * Math.pow(level, 1.5));
    },

    // ---- BANK VAULT SLOTS ----
    VAULT_UPGRADES: [
        { slots: 10, cost: 0 },
        { slots: 11, cost: 5000 },
        { slots: 15, cost: 15000 },
        { slots: 20, cost: 50000 },
        { slots: 30, cost: 150000 },
        { slots: 50, cost: 500000 },
    ],

    // ---- BUFFS ----
    BUFFS: {
        time_reduction: { name: 'Pengurangan Waktu', desc: 'Kurangi waktu yang dibutuhkan untuk tindakan sebesar 40%, dapat ditumpuk hingga 80%', maxStack: 2 },
        boost_reward: { name: 'Boost Hadiah', desc: 'Gandakan item dan exp! Durasi dan biaya akan meningkat 4 kali', multiplier: 4 },
        buff_exp: { name: 'Buff EXP', desc: 'Tingkatkan exp Anda hingga 80% selama 20 menit', duration: 1200, bonus: 0.8 },
    }
};
