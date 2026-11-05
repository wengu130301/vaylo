/* =====================================================================
   VayloOS — LaswI Studio
   腳本：配置驅動 + 三語 i18n + 幾何渲染 + 交互
   原生 JavaScript，不使用任何框架
   ===================================================================== */
'use strict';

/* ---------------------------------------------------------------------
   1. 可變數據集中配置
   —— 全頁所有可變內容均從此讀取，日後只需改這裡
   --------------------------------------------------------------------- */
const VAYLO = {
  name: 'VayloOS',
  brand: 'LaswI Studio',
  version: 'v0.1.0',                        // ← 請替換為正式版本號
  releaseDate: '2026-01-01',                // ← 請替換為正式發佈日期
  isoUrl: 'https://vaylo.nex.laswi.com.cn/vaylos.iso',
  isoFileName: 'vaylos.iso',
  isoSize: '2.4 GB',                        // ← 請替換為實際大小
  isoArch: 'x86_64',
  sha256: '0000000000000000000000000000000000000000000000000000000000000000', // ← 請替換為真實 SHA256
  siteUrl: 'vaylo.nex.laswi.com.cn',
  emails: ['3199704668@qq.com', '1828236908@qq.com'],

  /* 架構分層：width 為該層相對寬度（%），kernel 最寬以突出核心地位。
     ⚠ 目前尚無桌面環境，僅硬件 / 內核 / 系統服務三層 */
  layers: [
    { id: 'hw',      tone: 'amber',  width: 84 },
    { id: 'kernel',  tone: 'violet', width: 100 },
    { id: 'services', tone: 'indigo', width: 92 }
  ],

  /* 8 個特性磁貼：tone 輪換、span 控制拼貼大小，kernel 磁貼 2x2 作視覺錨點 */
  features: [
    { id: 'kernel',      icon: 'memory',      tone: 'violet', span: '2x2' },
    { id: 'notlinux',    icon: 'block',       tone: 'indigo', span: '1x1' },
    { id: 'memory',      icon: 'layers',      tone: 'cyan',   span: '1x1' },
    { id: 'scheduler',   icon: 'hub',         tone: 'indigo', span: '1x1' },
    { id: 'filesystem',  icon: 'folder_open', tone: 'violet', span: '1x1' },
    { id: 'drivers',     icon: 'extension',   tone: 'cyan',   span: '1x1' },
    { id: 'iso',         icon: 'album',       tone: 'indigo', span: '2x1' },
    { id: 'opensource',  icon: 'code',        tone: 'cyan',   span: '1x1' }
  ],

  /* 終端環境模擬：幾何色塊 + 少量技術字串（不譯，還原真實命令行觀感）。
     ⚠ 日後可將整個 .term-stage 區塊替換為真實截圖（保持 16:9 與圓角即可） */
  terminal: {
    title: 'vaylo@vaylos — tty0',
    dots: ['amber', 'cyan', 'violet'],
    /* lines 類型：cmd 命令提示行 / bars 輸出色塊 / text 單行輸出 / chips 服務名牌 */
    lines: [
      { type: 'cmd', text: 'boot --verbose' },
      { type: 'bars', tone: 'violet', bars: [72, 88, 44] },
      { type: 'cmd', text: 'vaylo --status' },
      { type: 'text', tone: 'cyan', text: 'VayloOS v0.1.0 · kernel 0.1.0 · x86_64 · up 00:12' },
      { type: 'cmd', text: 'ls /system/services' },
      { type: 'chips', items: ['device.svc', 'graphics.svc', 'files.svc', 'security.svc'] },
      { type: 'cmd', text: '', cursor: true }
    ],
    /* 狀態信息條：spacer 佔位撐開，其餘為帶文字的信息塊 */
    status: [
      { tone: 'cyan',   text: 'tty0' },
      { spacer: true },
      { tone: 'violet', text: 'MEM 128 / 512 MB' },
      { tone: 'indigo', text: 'CPU 2%' },
      { tone: 'amber',  text: '12:04' }
    ]
  },

  requirements: [
    { id: 'cpu',  value: 'x86_64' },
    { id: 'ram',  value: '8 GB' },
    { id: 'disk', value: '24 GB' },
    { id: 'gpu',  value: '1280 × 720' },
    { id: 'boot', value: 'UEFI / Legacy BIOS' }
  ],

  installSteps: ['s1', 's2', 's3'],

  changelog: [
    { version: 'v0.1.0', id: 'c1' },
    { version: 'v0.0.9', id: 'c2' },
    { version: 'v0.0.1', id: 'c3' }
  ]
};

/* ---------------------------------------------------------------------
   2. 三語字典（簡體 / 繁體 / English）
   產品名、版本號、網址、檔名、格式名不譯
   --------------------------------------------------------------------- */
const I18N = {
  zh: {
    'meta.title': 'VayloOS — 純自研內核操作系統 · LaswI Studio',
    'nav.home': '首頁', 'nav.what': '定位', 'nav.arch': '內核架構',
    'nav.features': '特性', 'nav.terminal': '終端', 'nav.download': '下載',
    'nav.downloadShort': '下載 ISO', 'nav.changelog': '更新日誌',
    'hero.eyebrow': '純自研內核操作系統 · LaswI Studio',
    'hero.tagline': '從內核第一行代碼開始，自己寫一個操作系統。',
    'hero.cmd': 'boot', 'hero.scroll': '向下捲動',
    'what.title': '什麼是 VayloOS',
    'what.note': '// 內核 · 系統服務 · 命令列環境，全部自主',
    positioning: [
      { hl: '不基於 Linux', rest: '內核從零寫起，引導、中斷、內存與調度全部自己實現。' },
      { hl: '全自主子系統', rest: '內存管理、進程調度、文件系統與驅動框架，均由本工作室獨立完成。' },
      { hl: '以 ISO 發佈', rest: '下載鏡像即可寫盤裝機，不依賴任何現成發行版。' }
    ],
    'arch.title': '內核架構', 'arch.hint': '從硬件到系統服務，三層結構 · 懸停或點按任一層查看細節',
    'arch.kernelBadge': '純自研', 'arch.detailKicker': 'LAYER DETAIL',
    layers: {
      hw: {
        name: '硬件層', desc: 'x86_64 平台 · CPU / 內存 / 存儲 / 外設',
        modules: ['CPU', '內存', '存儲', '外設'],
        detail: 'VayloOS 直接面向 x86_64 硬件，透過自研驅動框架與設備通信，不經過任何現成內核的中間抽象層。'
      },
      kernel: {
        name: '內核層', desc: 'VayloKernel · 自研核心',
        modules: ['內存管理', '進程調度', '中斷處理', '驅動框架'],
        detail: '內核是本頁的主角：內存分配、線程調度、中斷分發與驅動載入都在這一層完成，全部由本工作室從零實現，不含 Linux 代碼。'
      },
      services: {
        name: '系統服務層', desc: 'VayloSvc · 常駐守護與中間服務',
        modules: ['設備管理', '圖形服務', '文件服務', '安全策略'],
        detail: '常駐服務把內核能力封裝為穩定接口，向上為終端環境提供圖形、文件與權限能力，向下屏蔽硬件差異。'
      }
    },
    'feat.title': '核心特性', 'feat.hint': '磁貼每 5 秒自動翻面 · 懸停暫停並放大',
    features: {
      kernel: { title: '純自研內核', desc: '引導、中斷、內存與調度皆由本工作室獨立實現，內核代碼不含 Linux 片段。' },
      notlinux: { title: '不基於 Linux', desc: '沒有發行版血統，沒有現成內核可依賴，每一行都從零寫起。' },
      memory: { title: '自主內存管理', desc: '自研物理與虛擬內存分配器，頁表、映射與回收策略由自己掌控。' },
      scheduler: { title: '自主進程調度', desc: '自研調度器負責線程排程與時間片分配，優先級策略可配置。' },
      filesystem: { title: '自研文件系統', desc: '面向本地存儲的自研文件系統，目錄索引與元數據結構獨立設計。' },
      drivers: { title: '模塊化驅動', desc: '驅動以模塊形式載入與卸載，硬件支持可隨版本逐步擴展。' },
      iso: { title: 'ISO 直接裝機', desc: '以標準 ISO 鏡像發佈，寫入 U 盤即可引導安裝，無需額外工具鏈。' },
      opensource: { title: '開源可審計', desc: '核心代碼開放審計，任何人都能核對它到底是不是自己寫的。' }
    },
    'term.title': '終端環境', 'term.hint': '幾何色塊拼貼模擬，非真實截圖',
    'term.note': '/* 幾何拼貼模擬 — 日後可整塊替換為真實截圖 */',
    terminalCards: {
      launcher: { name: '啟動程序', desc: '一條命令拉起已編譯的程序，不必記住安裝路徑。' },
      settings: { name: '系統設置', desc: '鍵值式讀寫系統、顯示與網絡選項，改完即刻生效。' },
      files: { name: '文件管理', desc: '瀏覽、複製、移動與清理，目錄操作全部在命令行完成。' },
      shell: { name: '管道與腳本', desc: '命令串接成管道，常用流程寫成腳本一鍵執行。' }
    },
    'ver.released': '發佈日期', 'ver.arch': '架構', 'ver.size': '鏡像大小',
    'ver.req': '硬件要求', 'ver.reqTip': '安裝前請確認硬件兼容',
    'ver.reqNote': '// 以上數值為暫定，正式發佈前請以官方說明為準',
    'ver.changelogOpen': '展開完整更新日誌', 'ver.changelogClose': '收起更新日誌',
    reqLabels: { cpu: '處理器', ram: '內存', disk: '存儲', gpu: '顯示', boot: '引導方式' },
    'dl.title': '下載 VayloOS', 'dl.btn': '下載 ISO 鏡像',
    'dl.copy': '複製', 'dl.copied': '已複製 SHA256',
    'dl.shaHint': '下載後請校驗鏡像完整性',
    'dl.warning': '安裝系統有風險，請提前備份數據，建議先在虛擬機或備用設備上體驗。',
    steps: {
      s1: { n: '01', title: '取得鏡像', desc: '下載 vaylos.iso，並核對頁面上的 SHA256 校驗碼。' },
      s2: { n: '02', title: '寫入啟動盤', desc: '用寫盤工具把 ISO 寫入容量足夠的 U 盤，過程會清空該盤。' },
      s3: { n: '03', title: '引導並安裝', desc: '開機進入啟動選單選擇 U 盤，進入安裝器後選定磁碟與分區方案，確認後等待部署完成。' }
    },
    'ft.blurb': '使用問題、硬件兼容反饋或合作，歡迎郵件聯繫。',
    'ft.rights': '版權所有',
    changelog: {
      c1: '首個公開預覽版本：內核啟動、內存管理與基礎驅動框架。',
      c2: '內部測試：進程調度與文件系統原型接入。',
      c3: '倉庫初始化，工具鏈與引導程序骨架完成。'
    }
  },

  tw: {
    'meta.title': 'VayloOS — 純自研內核操作系統 · LaswI Studio',
    'nav.home': '首頁', 'nav.what': '定位', 'nav.arch': '內核架構',
    'nav.features': '特性', 'nav.terminal': '終端', 'nav.download': '下載',
    'nav.downloadShort': '下載 ISO', 'nav.changelog': '更新日誌',
    'hero.eyebrow': '純自研內核操作系統 · LaswI Studio',
    'hero.tagline': '從內核第一行程式碼開始，自己寫一個作業系統。',
    'hero.cmd': 'boot', 'hero.scroll': '向下捲動',
    'what.title': '什麼是 VayloOS',
    'what.note': '// 內核 · 系統服務 · 命令列環境，全部自主',
    positioning: [
      { hl: '不基於 Linux', rest: '內核從零寫起，開機引導、中斷、記憶體與排程全部自己實現。' },
      { hl: '全自主子系統', rest: '記憶體管理、行程排程、檔案系統與驅動框架，均由本工作室獨立完成。' },
      { hl: '以 ISO 發佈', rest: '下載鏡像即可寫入隨身碟裝機，不依賴任何現成發行版。' }
    ],
    'arch.title': '內核架構', 'arch.hint': '從硬體到系統服務，三層結構 · 懸停或點按任一層查看細節',
    'arch.kernelBadge': '純自研', 'arch.detailKicker': 'LAYER DETAIL',
    layers: {
      hw: {
        name: '硬體層', desc: 'x86_64 平台 · CPU / 記憶體 / 儲存 / 周邊',
        modules: ['CPU', '記憶體', '儲存', '周邊'],
        detail: 'VayloOS 直接面向 x86_64 硬體，透過自研驅動框架與裝置通訊，不經過任何現成內核的中間抽象層。'
      },
      kernel: {
        name: '內核層', desc: 'VayloKernel · 自研核心',
        modules: ['記憶體管理', '行程排程', '中斷處理', '驅動框架'],
        detail: '內核是本頁的主角：記憶體配置、執行緒排程、中斷分發與驅動載入都在這一層完成，全部由本工作室從零實現，不含 Linux 程式碼。'
      },
      services: {
        name: '系統服務層', desc: 'VayloSvc · 常駐守護與中介服務',
        modules: ['裝置管理', '圖形服務', '檔案服務', '安全策略'],
        detail: '常駐服務把內核能力封裝為穩定介面，向上為終端環境提供圖形、檔案與權限能力，向下遮蔽硬體差異。'
      }
    },
    'feat.title': '核心特性', 'feat.hint': '磁貼每 5 秒自動翻面 · 懸停暫停並放大',
    features: {
      kernel: { title: '純自研內核', desc: '開機引導、中斷、記憶體與排程皆由本工作室獨立實現，內核程式碼不含 Linux 片段。' },
      notlinux: { title: '不基於 Linux', desc: '沒有發行版血統，沒有現成內核可依賴，每一行都從零寫起。' },
      memory: { title: '自主記憶體管理', desc: '自研實體與虛擬記憶體配置器，頁表、映射與回收策略由自己掌控。' },
      scheduler: { title: '自主行程排程', desc: '自研排程器負責執行緒排程與時間片分配，優先級策略可設定。' },
      filesystem: { title: '自研檔案系統', desc: '面向本機儲存的自研檔案系統，目錄索引與中繼資料結構獨立設計。' },
      drivers: { title: '模組化驅動', desc: '驅動以模組形式載入與卸載，硬體支援可隨版本逐步擴充。' },
      iso: { title: 'ISO 直接裝機', desc: '以標準 ISO 鏡像發佈，寫入隨身碟即可開機安裝，無需額外工具鏈。' },
      opensource: { title: '開源可審計', desc: '核心程式碼開放審計，任何人都能核對它到底是不是自己寫的。' }
    },
    'term.title': '終端環境', 'term.hint': '幾何色塊拼貼模擬，非真實截圖',
    'term.note': '/* 幾何拼貼模擬 — 日後可整塊替換為真實截圖 */',
    terminalCards: {
      launcher: { name: '啟動程式', desc: '一行指令拉起已編譯的程式，不必記住安裝路徑。' },
      settings: { name: '系統設定', desc: '鍵值式讀寫系統、顯示與網路選項，改完即刻生效。' },
      files: { name: '檔案管理', desc: '瀏覽、複製、移動與清理，目錄操作全在命令列完成。' },
      shell: { name: '管線與腳本', desc: '指令串接成管線，常用流程寫成腳本一鍵執行。' }
    },
    'ver.released': '發佈日期', 'ver.arch': '架構', 'ver.size': '鏡像大小',
    'ver.req': '硬體要求', 'ver.reqTip': '安裝前請確認硬體相容',
    'ver.reqNote': '// 以上數值為暫定，正式發佈前請以官方說明為準',
    'ver.changelogOpen': '展開完整更新日誌', 'ver.changelogClose': '收起更新日誌',
    reqLabels: { cpu: '處理器', ram: '記憶體', disk: '儲存', gpu: '顯示', boot: '引導方式' },
    'dl.title': '下載 VayloOS', 'dl.btn': '下載 ISO 鏡像',
    'dl.copy': '複製', 'dl.copied': '已複製 SHA256',
    'dl.shaHint': '下載後請校驗鏡像完整性',
    'dl.warning': '安裝系統有風險，請提前備份資料，建議先在虛擬機或備用裝置上體驗。',
    steps: {
      s1: { n: '01', title: '取得鏡像', desc: '下載 vaylos.iso，並核對頁面上的 SHA256 校驗碼。' },
      s2: { n: '02', title: '寫入開機碟', desc: '用寫碟工具把 ISO 寫入容量足夠的隨身碟，過程會清空該碟。' },
      s3: { n: '03', title: '開機並安裝', desc: '開機進入啟動選單選擇隨身碟，進入安裝器後選定磁碟與分割方案，確認後等待部署完成。' }
    },
    'ft.blurb': '使用問題、硬體相容回饋或合作，歡迎郵件聯繫。',
    'ft.rights': '版權所有',
    changelog: {
      c1: '首個公開預覽版本：內核啟動、記憶體管理與基礎驅動框架。',
      c2: '內部測試：行程排程與檔案系統原型接入。',
      c3: '儲存庫初始化，工具鏈與引導程式骨架完成。'
    }
  },

  en: {
    'meta.title': 'VayloOS — A from-scratch kernel OS · LaswI Studio',
    'nav.home': 'Home', 'nav.what': 'Positioning', 'nav.arch': 'Architecture',
    'nav.features': 'Features', 'nav.terminal': 'Terminal', 'nav.download': 'Download',
    'nav.downloadShort': 'Get ISO', 'nav.changelog': 'Changelog',
    'hero.eyebrow': 'A from-scratch kernel OS · LaswI Studio',
    'hero.tagline': 'An operating system written from the kernel\'s very first line of code.',
    'hero.cmd': 'boot', 'hero.scroll': 'Scroll',
    'what.title': 'What is VayloOS',
    'what.note': '// kernel · system services · command line — all built in-house',
    positioning: [
      { hl: 'Not Linux-based', rest: 'The kernel is written from zero: boot, interrupts, memory and scheduling are all our own.' },
      { hl: 'Every subsystem in-house', rest: 'Memory manager, scheduler, file system and driver framework are all built independently by the studio.' },
      { hl: 'Shipped as an ISO', rest: 'Download the image, write it to a drive, install it — no distro underneath.' }
    ],
    'arch.title': 'Kernel Architecture', 'arch.hint': 'Three layers from hardware to system services · hover or tap a layer for details',
    'arch.kernelBadge': 'IN-HOUSE', 'arch.detailKicker': 'LAYER DETAIL',
    layers: {
      hw: {
        name: 'Hardware', desc: 'x86_64 platform · CPU / memory / storage / peripherals',
        modules: ['CPU', 'Memory', 'Storage', 'Peripherals'],
        detail: 'VayloOS talks to x86_64 hardware directly through its own driver framework, with no existing kernel abstraction layer in between.'
      },
      kernel: {
        name: 'Kernel', desc: 'VayloKernel · the in-house core',
        modules: ['Memory', 'Scheduler', 'Interrupts', 'Drivers'],
        detail: 'The kernel is the protagonist: allocation, thread scheduling, interrupt dispatch and driver loading all happen here, implemented entirely from scratch — no Linux code.'
      },
      services: {
        name: 'System Services', desc: 'VayloSvc · daemons and middleware',
        modules: ['Devices', 'Graphics', 'Files', 'Security'],
        detail: 'Resident services wrap kernel capabilities into stable interfaces, offering graphics, file and permission services to the terminal environment above.'
      }
    },
    'feat.title': 'Core Features', 'feat.hint': 'Tiles flip every 5 seconds · hover to pause and enlarge',
    features: {
      kernel: { title: 'In-house kernel', desc: 'Boot, interrupts, memory and scheduling are all implemented by the studio. No Linux code inside.' },
      notlinux: { title: 'Not Linux-based', desc: 'No distro lineage, no ready-made kernel to lean on. Every line starts from zero.' },
      memory: { title: 'Own memory manager', desc: 'A self-built physical and virtual allocator: page tables, mapping and reclaim are ours to control.' },
      scheduler: { title: 'Own scheduler', desc: 'A self-built scheduler handles thread scheduling and time slices, with configurable priority policies.' },
      filesystem: { title: 'Own file system', desc: 'A local-storage file system designed from scratch, with independent directory index and metadata.' },
      drivers: { title: 'Modular drivers', desc: 'Drivers load and unload as modules, so hardware support grows release by release.' },
      iso: { title: 'Install from ISO', desc: 'Shipped as a standard ISO image: write it to a USB drive and boot, no extra toolchain.' },
      opensource: { title: 'Auditable source', desc: 'Core code is open for audit — anyone can verify it really was written from scratch.' }
    },
    'term.title': 'Terminal Environment', 'term.hint': 'Geometric colour blocks, not a screenshot',
    'term.note': '/* geometric simulation — swap the whole block for a real screenshot later */',
    terminalCards: {
      launcher: { name: 'Launch programs', desc: 'Start any built binary with one command — no install paths to memorise.' },
      settings: { name: 'System settings', desc: 'Read and write system, display and network keys; changes apply instantly.' },
      files: { name: 'File management', desc: 'Browse, copy, move and clean up — every directory task happens in the shell.' },
      shell: { name: 'Pipes and scripts', desc: 'Chain commands into pipelines and script recurring work to run in one go.' }
    },
    'ver.released': 'Released', 'ver.arch': 'Arch', 'ver.size': 'Image size',
    'ver.req': 'Hardware requirements', 'ver.reqTip': 'check compatibility before installing',
    'ver.reqNote': '// values above are provisional — refer to official docs before release',
    'ver.changelogOpen': 'Show full changelog', 'ver.changelogClose': 'Collapse changelog',
    reqLabels: { cpu: 'Processor', ram: 'Memory', disk: 'Storage', gpu: 'Display', boot: 'Boot mode' },
    'dl.title': 'Download VayloOS', 'dl.btn': 'Download ISO image',
    'dl.copy': 'Copy', 'dl.copied': 'SHA256 copied',
    'dl.shaHint': 'Verify the image after downloading',
    'dl.warning': 'Installing an OS carries risk. Back up your data first, and try it in a virtual machine or on a spare device.',
    steps: {
      s1: { n: '01', title: 'Get the image', desc: 'Download vaylos.iso and check it against the SHA256 shown on this page.' },
      s2: { n: '02', title: 'Write a boot drive', desc: 'Use a flashing tool to write the ISO to a large enough USB drive; it will be erased.' },
      s3: { n: '03', title: 'Boot and install', desc: 'Open the boot menu, pick the drive entry, then choose a disk and partition layout and wait for deployment.' }
    },
    'ft.blurb': 'Questions, hardware compatibility reports or partnerships — just email us.',
    'ft.rights': 'All rights reserved',
    changelog: {
      c1: 'First public preview: kernel boot, memory management and the base driver framework.',
      c2: 'Internal test: scheduler and file system prototypes wired in.',
      c3: 'Repository initialised; toolchain and bootloader skeleton completed.'
    }
  }
};

/* ---------------------------------------------------------------------
   3. 狀態與工具
   --------------------------------------------------------------------- */
const state = {
  lang: 'zh',
  archIdx: 1,
  flipIdx: 0,
  flipTimer: null,
  toastTimer: null
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const T = () => I18N[state.lang];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------------
   4. 渲染
   --------------------------------------------------------------------- */

/* ③ 定位宣言 */
function renderPositioning() {
  const list = T().positioning;
  $('#manifest').innerHTML = list.map((p, i) => `
    <div class="manifest-line">
      <span class="m-idx mono">0${i + 1}</span>
      <p class="m-text"><span class="m-hl">${p.hl}</span>${p.rest}</p>
    </div>`).join('');
}

/* ④ 內核架構：配置順序為自下而上，靠 CSS column-reverse 呈現 */
function renderArch() {
  const L = T();
  const parts = [];
  VAYLO.layers.forEach((layer, i) => {
    if (i > 0) parts.push(`<div class="arch-link" data-link="${i}" aria-hidden="true">
      <i class="arch-node"></i><i class="arch-node"></i></div>`);
    const t = L.layers[layer.id];
    parts.push(`
      <article class="arch-layer" data-tone="${layer.tone}" data-idx="${i}"
               style="--layer-w:${layer.width}%" tabindex="0" role="button"
               aria-label="${t.name}">
        <div class="arch-layer-head">
          <h3 class="arch-layer-name">${t.name}</h3>
          ${layer.id === 'kernel' ? `<span class="pill-kernel mono">${L['arch.kernelBadge']}</span>` : ''}
          <span class="arch-layer-idx mono">0${i + 1}</span>
        </div>
        <p class="arch-layer-desc mono">${t.desc}</p>
        <ul class="arch-mods">${t.modules.map(m => `<li class="mod mono">${m}</li>`).join('')}</ul>
      </article>`);
  });
  $('#archStack').innerHTML = parts.join('');
  bindArch();
}

function renderArchDetail(idx) {
  const layer = VAYLO.layers[idx] || VAYLO.layers[1];
  const t = T().layers[layer.id];
  const box = $('#archDetail');
  box.dataset.tone = layer.tone;
  box.innerHTML = `
    <p class="arch-detail-k mono">// ${T()['arch.detailKicker']}</p>
    <h3>${t.name}</h3>
    <p class="arch-detail-desc mono">${t.desc}</p>
    <p class="arch-detail-body">${t.detail}</p>
    <div class="arch-detail-chips">${t.modules.map(m => `<span>${m}</span>`).join('')}</div>`;
}

function bindArch() {
  const stack = $('#archStack');
  const layers = $$('.arch-layer', stack);
  const links = $$('.arch-link', stack);

  const setActive = (idx) => {
    stack.classList.add('has-active');
    layers.forEach(l => l.classList.toggle('is-active', Number(l.dataset.idx) === idx));
    links.forEach(l => {
      const n = Number(l.dataset.link);
      l.classList.toggle('is-hot', n === idx || n === idx + 1);
    });
    renderArchDetail(idx);
  };
  const clearHover = () => {
    stack.classList.remove('has-active');
    layers.forEach(l => l.classList.remove('is-active'));
    links.forEach(l => l.classList.remove('is-hot'));
    renderArchDetail(state.archIdx);
  };

  layers.forEach(l => {
    const idx = Number(l.dataset.idx);
    l.addEventListener('mouseenter', () => setActive(idx));
    l.addEventListener('focus', () => setActive(idx));
    l.addEventListener('click', () => { state.archIdx = idx; setActive(idx); });
    l.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.archIdx = idx; setActive(idx); }
    });
  });
  stack.addEventListener('mouseleave', clearHover);

  /* 觸控裝置無 hover：點按空白處或再次點按當前層即回到默認展示狀態 */
  document.addEventListener('pointerdown', (e) => {
    if (!stack.classList.contains('has-active')) return;
    if (!e.target.closest('.arch-layer')) clearHover();
  });
  renderArchDetail(state.archIdx);
}

/* ⑤ 特性磁貼 */
function renderFeatures() {
  const L = T();
  $('#tiles').innerHTML = VAYLO.features.map((f, i) => {
    const t = L.features[f.id];
    return `
      <article class="tile" data-tone="${f.tone}" data-span="${f.span}" tabindex="0" role="button"
               aria-label="${t.title}" aria-pressed="false">
        <div class="tile-inner">
          <div class="face face-front">
            <div class="tile-top">
              <span class="material-symbols-rounded tile-icon" aria-hidden="true">${f.icon}</span>
              <span class="tile-caret" aria-hidden="true"></span>
            </div>
            <h3 class="tile-title">${t.title}</h3>
            <span class="tile-tag mono">0${i + 1}</span>
          </div>
          <div class="face face-back">
            <span class="tile-tag mono">${f.id.toUpperCase()}</span>
            <p class="tile-desc">${t.desc}</p>
          </div>
        </div>
      </article>`;
  }).join('');

  $$('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const on = tile.classList.toggle('is-flipped');
      tile.setAttribute('aria-pressed', String(on));
    });
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const on = tile.classList.toggle('is-flipped');
        tile.setAttribute('aria-pressed', String(on));
      }
    });
  });

  const grid = $('#tiles');
  grid.addEventListener('mouseenter', stopFlip);
  grid.addEventListener('mouseleave', startFlip);
  startFlip();
}

function stopFlip() {
  if (state.flipTimer) { clearInterval(state.flipTimer); state.flipTimer = null; }
}
function startFlip() {
  stopFlip();
  if (reduceMotion) return;
  state.flipTimer = setInterval(() => {
    const tiles = $$('.tile');
    if (!tiles.length) return;
    const tile = tiles[state.flipIdx % tiles.length];
    state.flipIdx += 1;
    if (!tile.classList.contains('is-flipped')) {
      tile.classList.add('is-flipped');
      tile.setAttribute('aria-pressed', 'true');
    }
  }, 5000);
}

/* ⑥ 終端環境模擬（一次渲染，不做逐幀計算） */
function buildTerminal() {
  const t = VAYLO.terminal;
  const tones = ['indigo', 'cyan', 'violet', 'amber'];

  const renderLine = (l) => {
    if (l.type === 'bars') {
      return `<div class="t-bars" data-tone="${l.tone || 'cyan'}">${
        l.bars.map(w => `<span class="t-bar" style="width:${w}%"></span>`).join('')
      }</div>`;
    }
    if (l.type === 'text') {
      return `<p class="t-out mono" data-tone="${l.tone || 'cyan'}">${l.text}</p>`;
    }
    if (l.type === 'chips') {
      return `<div class="t-chips">${
        l.items.map((it, i) => `<span class="t-chip mono" data-tone="${tones[i % tones.length]}">${it}</span>`).join('')
      }</div>`;
    }
    return `<div class="t-line">
        <span class="t-prompt mono" aria-hidden="true">$</span>
        <span class="t-cmd mono">${l.text || ''}</span>
        ${l.cursor ? '<span class="t-cursor" aria-hidden="true"></span>' : ''}
      </div>`;
  };

  const status = t.status.map(s => {
    if (s.spacer) return '<span class="t-spacer"></span>';
    return `<span class="t-st mono" data-tone="${s.tone}">${s.text}</span>`;
  }).join('');

  $('#termStage').innerHTML = `
    <div class="t-window">
      <div class="t-bar">
        <span class="t-dots">${t.dots.map(d => `<span class="t-dot" data-tone="${d}"></span>`).join('')}</span>
        <span class="t-bar-title mono">${t.title}</span>
        <span class="t-bar-tag mono">x86_64</span>
      </div>
      <div class="t-body">${t.lines.map(renderLine).join('')}</div>
      <div class="t-status">${status}</div>
    </div>`;
}

function renderTermCards() {
  const L = T().terminalCards;
  const items = [
    { key: 'launcher', icon: 'rocket_launch' },
    { key: 'settings', icon: 'tune' },
    { key: 'files', icon: 'folder_open' },
    { key: 'shell', icon: 'code' }
  ];
  $('#termCards').innerHTML = items.map(it => `
    <article class="term-card">
      <span class="material-symbols-rounded" aria-hidden="true">${it.icon}</span>
      <h4>${L[it.key].name}</h4>
      <p>${L[it.key].desc}</p>
    </article>`).join('');
}

/* ⑦ 硬件要求與更新日誌 */
function renderRequirements() {
  const L = T();
  $('#reqList').innerHTML = VAYLO.requirements.map(r => `
    <li><span class="rk">${L.reqLabels[r.id]}</span><span class="rv">${r.value}</span></li>`).join('');
}

function renderChangelog() {
  const L = T();
  const fmt = (c) => `${c.version} — ${L.changelog[c.id]}`;
  $('#verList').innerHTML = VAYLO.changelog.slice(0, 2).map(c => `<li>${fmt(c)}</li>`).join('');
  $('#clogList').innerHTML = VAYLO.changelog.map(c => `
    <li><span class="cv">${c.version}</span><span>${L.changelog[c.id]}</span></li>`).join('');
}

/* ⑧ 安裝步驟 */
function renderSteps() {
  const L = T();
  $('#steps').innerHTML = VAYLO.installSteps.map(id => `
    <article class="step">
      <span class="step-n">${L.steps[id].n}</span>
      <h4>${L.steps[id].title}</h4>
      <p>${L.steps[id].desc}</p>
    </article>`).join('');
}

/* ⑨ 頁腳郵箱 */
function renderMails() {
  $('#mailList').innerHTML = VAYLO.emails.map(m =>
    `<a href="mailto:${m}">${m}</a>`).join('');
}

/* SHA256 顯示：默認截斷前後各 16 位，點擊展開全文 */
let shaExpanded = false;
function renderSha() {
  const btn = $('#shaVal');
  const v = VAYLO.sha256;
  btn.textContent = shaExpanded || v.length <= 40
    ? v
    : `${v.slice(0, 16)}…${v.slice(-16)}`;
  btn.title = shaExpanded ? '' : v;
  btn.setAttribute('aria-expanded', String(shaExpanded));
}

/* 靜態配置寫入 DOM */
function applyConfig() {
  const version = VAYLO.version;
  document.title = T()['meta.title'];
  $('#verBadge').textContent = version;
  $('#verBig').textContent = version;
  $('#verDate').textContent = VAYLO.releaseDate;
  $('#verArch').textContent = VAYLO.isoArch;
  $('#verSize').textContent = VAYLO.isoSize;

  /* 下載鏈接單一來源，兩處同源 */
  $('#navDl').href = VAYLO.isoUrl;
  $('#dlBtn').href = VAYLO.isoUrl;

  $('#mirName').textContent = VAYLO.isoFileName;
  $('#mirMeta').textContent = `${version} · ${VAYLO.isoSize} · ${VAYLO.isoArch}`;
  $('#rights').textContent = `© LaswI Studio / VayloOS · ${version}`;

  renderSha();
}

/* ---------------------------------------------------------------------
   5. 語言切換
   --------------------------------------------------------------------- */
function setLang(lang) {
  if (!I18N[lang]) return;
  state.lang = lang;
  const L = I18N[lang];

  document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'tw' ? 'zh-Hant' : 'zh-Hans');
  document.documentElement.setAttribute('data-lang', lang);

  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (L[key] != null) el.textContent = L[key];
  });

  $$('[data-lang-btn]').forEach(b => {
    const on = b.dataset.langBtn === lang;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });

  /* 動態內容整體重繪 */
  renderPositioning();
  renderArch();
  renderFeatures();
  renderTermCards();
  renderRequirements();
  renderChangelog();
  renderSteps();
  applyConfig();

  /* 更新日誌折疊按鈕文案 */
  const opened = $('#clog').classList.contains('is-open');
  $('#clogToggleText').textContent = opened ? L['ver.changelogClose'] : L['ver.changelogOpen'];

  /* 淡入動效 */
  document.body.classList.remove('lang-fade');
  void document.body.offsetWidth;
  document.body.classList.add('lang-fade');
  window.setTimeout(() => document.body.classList.remove('lang-fade'), 460);

  observeReveals();
}

/* ---------------------------------------------------------------------
   6. 交互：滾動、視差、入場、校驗碼、浮層
   --------------------------------------------------------------------- */
function initNav() {
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initParallax() {
  if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
  const hero = $('.hero');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - .5) * 2;
    const my = ((e.clientY - r.top) / r.height - .5) * 2;
    hero.style.setProperty('--mx', mx.toFixed(3));
    hero.style.setProperty('--my', my.toFixed(3));
  });
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });

function observeReveals() {
  $$('.reveal:not(.is-in)').forEach(el => io.observe(el));
}

function showToast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove('is-on'), 2000);
}

function fallbackCopy(text) {
  const el = $('#shaVal');
  const prev = el.textContent;
  el.textContent = text;
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  try { document.execCommand('copy'); } catch (_) { /* 已選中文本，用戶可手動複製 */ }
  if (!shaExpanded) { el.textContent = prev; }
}

async function copySha() {
  const value = VAYLO.sha256;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      showToast(T()['dl.copied']);
    } else {
      fallbackCopy(value);
      showToast(T()['dl.copied']);
    }
  } catch (err) {
    /* 剪貼板 API 不可用或被拒絕：降級為選中文本 */
    fallbackCopy(value);
    showToast(T()['dl.copied']);
  }
}

function initSha() {
  const val = $('#shaVal');
  val.addEventListener('click', () => {
    shaExpanded = !shaExpanded;
    renderSha();
  });
  $('#shaCopy').addEventListener('click', copySha);
}

function initChangelogToggle() {
  const wrap = $('#clog');
  const btn = $('#clogToggle');
  btn.addEventListener('click', () => {
    const open = wrap.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    $('#clogToggleText').textContent = open ? T()['ver.changelogClose'] : T()['ver.changelogOpen'];
  });
}

function initRipple() {
  const btn = $('#dlBtn');
  btn.addEventListener('click', (e) => {
    if (reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const span = document.createElement('span');
    const size = Math.max(r.width, r.height);
    span.className = 'ripple';
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - r.left - size / 2}px`;
    span.style.top = `${e.clientY - r.top - size / 2}px`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 640);
  });
}

/* ---------------------------------------------------------------------
   7. 啟動
   --------------------------------------------------------------------- */
function init() {
  buildTerminal();
  renderMails();
  initNav();
  initParallax();
  initSha();
  initChangelogToggle();
  initRipple();

  /* 首次渲染（沿用 HTML 中的簡體文案，再以字典校驗一次） */
  renderPositioning();
  renderArch();
  renderFeatures();
  renderTermCards();
  renderRequirements();
  renderChangelog();
  renderSteps();
  applyConfig();

  $$('[data-lang-btn]').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.langBtn));
  });

  if (reduceMotion) {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
  } else {
    observeReveals();
  }
}

document.addEventListener('DOMContentLoaded', init);
